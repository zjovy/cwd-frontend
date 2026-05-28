import { useLayoutEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import {
  getReceiptPlaceholderMeta,
  splitMessageParts,
} from '@/utils/receiptTemplate';

function pillInlineStyle(pill) {
  return {
    display: 'inline-block',
    padding: '1px 9px',
    margin: '0 2px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '1.5',
    verticalAlign: 'baseline',
    background: pill.background,
    color: pill.color,
    border: `1px solid ${pill.border}`,
    userSelect: 'none',
    cursor: 'default',
  };
}

const ZWSP = '\u200B';

const editorStyle = {
  fontSize: '14px',
  fontFamily: 'inherit',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '200px',
  lineHeight: 1.65,
  color: '#374151',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

function isPillNode(node) {
  return (
    node?.nodeType === Node.ELEMENT_NODE &&
    Boolean(node.dataset?.receiptPlaceholder)
  );
}

function isZwspNode(node) {
  return (
    node?.nodeType === Node.TEXT_NODE &&
    node.textContent.replaceAll(ZWSP, '') === ''
  );
}

function appendTextWithBreaks(parent, text) {
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) parent.appendChild(document.createElement('br'));
    if (line) parent.appendChild(document.createTextNode(line));
  });
}

function appendPill(parent, meta) {
  const pill = document.createElement('span');
  pill.contentEditable = 'false';
  pill.dataset.receiptPlaceholder = meta.id;
  pill.title = 'Filled in automatically for each donor';
  pill.textContent = meta.label;
  Object.assign(pill.style, pillInlineStyle(meta.pill));
  parent.appendChild(pill);
  parent.appendChild(document.createTextNode(ZWSP));
}

function populateReceiptEditor(root, editBody) {
  root.innerHTML = '';
  const parts = splitMessageParts(editBody);

  for (const part of parts) {
    if (part.type === 'placeholder') {
      const meta = getReceiptPlaceholderMeta(part.id);
      if (meta) appendPill(root, meta);
      continue;
    }
    appendTextWithBreaks(root, part.value);
  }
}

function readLineFromNode(node) {
  let line = '';

  const walk = (current) => {
    if (current.nodeType === Node.TEXT_NODE) {
      line += current.textContent.replaceAll(ZWSP, '');
      return;
    }
    if (current.nodeName === 'BR') {
      line += '\n';
      return;
    }
    if (isPillNode(current)) {
      const meta = getReceiptPlaceholderMeta(current.dataset.receiptPlaceholder);
      if (meta) line += meta.editToken;
      return;
    }
    current.childNodes.forEach(walk);
  };

  walk(node);
  return line;
}

function serializeReceiptEditor(root) {
  if (!root) return '';

  const childNodes = Array.from(root.childNodes);
  if (childNodes.length === 0) return '';

  const usesBlockLines = childNodes.some(
    (node) => node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DIV'
  );

  if (!usesBlockLines) {
    return readLineFromNode(root);
  }

  return childNodes
    .map((node) => {
      if (node.nodeName === 'BR') return '';
      return readLineFromNode(node);
    })
    .join('\n');
}

function removePill(pill) {
  const after = pill.nextSibling;
  if (isZwspNode(after)) after.remove();
  pill.remove();
}

function getPillBeforeCursor(range) {
  const { startContainer, startOffset } = range;
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer.textContent;
    if (startOffset === 0 || (text.includes(ZWSP) && startOffset <= 1)) {
      let prev = startContainer.previousSibling;
      if (isZwspNode(prev)) prev = prev.previousSibling;
      if (isPillNode(prev)) return prev;
    }
  }

  if (startContainer.nodeType === Node.ELEMENT_NODE && startOffset > 0) {
    let prev = startContainer.childNodes[startOffset - 1];
    if (isZwspNode(prev)) prev = prev.previousSibling;
    if (isPillNode(prev)) return prev;
  }

  return null;
}

function getPillAfterCursor(range) {
  const { startContainer, startOffset } = range;
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer.textContent;
    if (startOffset >= text.length) {
      let next = startContainer.nextSibling;
      if (isZwspNode(next)) next = next.nextSibling;
      if (isPillNode(next)) return next;
    }
  }

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    let next = startContainer.childNodes[startOffset];
    if (isZwspNode(next)) next = next.nextSibling;
    if (isPillNode(next)) return next;
  }

  return null;
}

function getSelectedPills(range) {
  if (range.collapsed) return [];
  const root = range.commonAncestorContainer;
  const element =
    root.nodeType === Node.ELEMENT_NODE ? root : root.parentElement;
  if (!element) return [];

  return Array.from(element.querySelectorAll('[data-receipt-placeholder]')).filter(
    (pill) => range.intersectsNode(pill)
  );
}

export default function ReceiptMessageEditor({ initialValue, onChange }) {
  const editorRef = useRef(null);

  const syncToParent = () => {
    if (!editorRef.current) return;
    onChange(serializeReceiptEditor(editorRef.current));
  };

  useLayoutEffect(() => {
    if (!editorRef.current) return;
    populateReceiptEditor(editorRef.current, initialValue);
    syncToParent();
    // Populate once per mount; parent remounts via key when resetting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = () => {
    syncToParent();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    syncToParent();
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedPills = getSelectedPills(range);

    if (selectedPills.length > 0) {
      event.preventDefault();
      selectedPills.forEach(removePill);
      syncToParent();
      return;
    }

    if (!range.collapsed) return;

    const pill =
      event.key === 'Backspace'
        ? getPillBeforeCursor(range)
        : getPillAfterCursor(range);

    if (!pill) return;

    event.preventDefault();
    removePill(pill);
    syncToParent();
  };

  return (
    <div
      ref={editorRef}
      id='bulk-send-message'
      role='textbox'
      aria-multiline='true'
      contentEditable
      suppressContentEditableWarning
      style={editorStyle}
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
    />
  );
}

ReceiptMessageEditor.propTypes = {
  initialValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

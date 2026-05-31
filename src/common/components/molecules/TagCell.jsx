import { useState } from 'react';

import PropTypes from 'prop-types';

const chip = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '500',
  background: '#eff6ff',
  color: '#1d4ed8',
};

const removeBtn = {
  background: 'none',
  border: 'none',
  padding: '0 0 0 2px',
  cursor: 'pointer',
  color: '#93c5fd',
  fontSize: '12px',
  lineHeight: 1,
};

const addBtn = {
  background: 'none',
  border: '1px dashed #d1d5db',
  borderRadius: '4px',
  padding: '1px 6px',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '11px',
};

const inputStyle = {
  width: '72px',
  padding: '1px 5px',
  border: '1px solid #93c5fd',
  borderRadius: '4px',
  fontSize: '11px',
  outline: 'none',
};

const wrap = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  alignItems: 'center',
  minWidth: '100px',
};

export default function TagCell({ tags, onAdd, onRemove }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');

  const commit = () => {
    if (value.trim()) onAdd(value.trim());
    setValue('');
    setAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Escape') {
      setValue('');
      setAdding(false);
    }
  };

  return (
    <div style={wrap}>
      {tags.map((t) => (
        <span key={t} style={chip}>
          {t}
          <button type='button' style={removeBtn} onClick={() => onRemove(t)}>
            ×
          </button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          style={inputStyle}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder='tag…'
        />
      ) : (
        <button type='button' style={addBtn} onClick={() => setAdding(true)}>
          + tag
        </button>
      )}
    </div>
  );
}

TagCell.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

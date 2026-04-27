import { useState } from 'react';

import PropTypes from 'prop-types';

const actionsBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '18px',
  letterSpacing: '2px',
  padding: '0 4px',
  lineHeight: 1,
  position: 'relative',
};

const menuStyle = {
  position: 'absolute',
  right: 0,
  top: '100%',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,.1)',
  zIndex: 10,
  minWidth: '160px',
  overflow: 'hidden',
};

const menuItem = {
  display: 'block',
  width: '100%',
  padding: '8px 14px',
  fontSize: '13px',
  color: '#374151',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
};

const menuItemDanger = { ...menuItem, color: '#dc2626' };

export default function ActionsMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <span style={{ position: 'relative' }}>
      <button
        type='button'
        style={actionsBtnStyle}
        onClick={() => setOpen((v) => !v)}
      >
        ···
      </button>
      {open && (
        <>
          <div
            role='button'
            tabIndex={-1}
            style={{ position: 'fixed', inset: 0, zIndex: 9 }}
            onClick={close}
            onKeyDown={(e) => e.key === 'Escape' && close()}
          />
          <div style={menuStyle}>
            {actions.map(({ label, onClick, danger, disabled }) => (
              <button
                key={label}
                type='button'
                style={
                  disabled
                    ? {
                        ...(danger ? menuItemDanger : menuItem),
                        opacity: 0.4,
                        cursor: 'not-allowed',
                      }
                    : danger
                      ? menuItemDanger
                      : menuItem
                }
                disabled={disabled}
                onClick={() => {
                  close();
                  onClick();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  );
}

ActionsMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      danger: PropTypes.bool,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
};

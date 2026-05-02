/*
  CommonButton component
  Used for displaying a button with a variety of styles and functionalities.

  Props:
    - children (node): The content to display inside the button.
    - variant (string): The variant of the button.
    - onClick (function): The function to call when the button is clicked.
    - title (string): The title of the button.
*/
import React from 'react';

import PropTypes from 'prop-types';

export { Button };

const variants = {
  outline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '8px 16px',
    border: '1px solid #e8e8e6',
    borderRadius: '8px',
    background: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  ghost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '4px 8px',
    border: 'none',
    borderRadius: '6px',
    background: 'transparent',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};

export default function Button({ children, variant, onClick, title }) {
  return (
    <button style={variants[variant]} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['outline', 'ghost']),
  onClick: PropTypes.func,
  title: PropTypes.string,
};

Button.defaultProps = {
  variant: 'outline',
  onClick: undefined,
  title: undefined,
};

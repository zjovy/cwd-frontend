import PropTypes from 'prop-types';

import { StyledButton } from './styles';

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
export default function SubmitButton({ children, onClick, disabled = false }) {
  return (
    <StyledButton type='submit' onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}

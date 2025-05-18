import React from 'react';
import './passwordToggle.css';

//Componente para ver a password
function PasswordToggle({ showPassword, toggleVisibility }) {
  return (
    <button 
      type="button" 
      onClick={toggleVisibility}
      className="eye-button"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? "👁️" : "👁️‍🗨️"}
    </button>
  );
}

export default PasswordToggle;
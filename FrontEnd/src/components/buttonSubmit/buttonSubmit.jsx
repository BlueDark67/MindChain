import React from 'react';
import './buttonSubmit.css';

//Componente de um botao de submiting (tbm de loading)
const ButtonSubmit = ({ 
  onClick, 
  text, 
  variant = 'primary', 
  size = 'w100h40', 
  disabled = false, 
  isSubmitting = false,
  type = 'button'
}) => {
  const getClassName = () => {
    return `button-Submiting ${variant} ${size} ${disabled || isSubmitting ? 'disabled' : ''}`;
  };

  return (
    <button
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? "Submiting..." : text}
    </button>
  );
};



export default ButtonSubmit;
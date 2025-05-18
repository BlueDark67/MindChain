import React from 'react';
import './Button.css';

//Componente de um botao normal
const Button = ({ 
    onClick, 
    children, 
    type = 'button',
    className = '',
    disabled = false
}) => {
    return (
        <button
            type={type}
            className={`custom-button ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
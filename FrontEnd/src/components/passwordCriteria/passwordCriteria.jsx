import React from 'react';
import './PasswordCriteria.css';

function PasswordCriteriaTooltip({ password, isVisible, isPasswordCriterionMet }) {
  if (!isVisible) return null;
  
  return (
    <div className="password-criteria-tooltip">
      <h4>Password must have:</h4>
      <ul>
        <li className={isPasswordCriterionMet('length', password) ? "met" : ""}>
          At least 6 characters
        </li>
        <li className={isPasswordCriterionMet('uppercase', password) ? "met" : ""}>
          At least one uppercase letter
        </li>
        <li className={isPasswordCriterionMet('lowercase', password) ? "met" : ""}>
          At least one lowercase letter
        </li>
        <li className={isPasswordCriterionMet('number', password) ? "met" : ""}>
          At least one number
        </li>
        <li className={isPasswordCriterionMet('symbol', password) ? "met" : ""}>
          At least one symbol
        </li>
      </ul>
    </div>
  );
}

export default PasswordCriteriaTooltip;
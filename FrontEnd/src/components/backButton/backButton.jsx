import React from 'react';
import './backButton.css';
import { useNavigate } from 'react-router-dom'; 

const BackButton = ({ customClass = "" }) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <button 
      className={`back-button-circle ${customClass}`} 
      onClick={handleGoBack}
     
    >
        {/**Este botão foi um demonio para meter direito*/}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12H5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      
    </button>
  );
};

export default BackButton;
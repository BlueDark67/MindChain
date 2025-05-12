import React, { useState, useEffect } from 'react';
import './Loading.css';

function Loading({ isLoading, minDisplayTime = 500 }) {
  const [shouldDisplay, setShouldDisplay] = useState(isLoading);
  
  useEffect(() => {
    let timer;
    
    if (isLoading) {
      setShouldDisplay(true);
    } else if (shouldDisplay) {
      // Quando isLoading se torna false, aguarde pelo menos minDisplayTime antes de ocultar
      timer = setTimeout(() => {
        setShouldDisplay(false);
      }, minDisplayTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, minDisplayTime, shouldDisplay]);
  
  if (!shouldDisplay) return null;
  
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Carregando...</p>
    </div>
  );
}

export default Loading;
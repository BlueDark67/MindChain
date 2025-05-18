import React, { useState, useEffect } from 'react';
import './Loading.css';

//Componente de Loading de quando a pagina demora para carregar
//Só se ficar extremamente lento é que é ativado
function Loading({ isLoading, minDisplayTime = 500 }) {
  const [shouldDisplay, setShouldDisplay] = useState(isLoading);
  
  useEffect(() => {
    let timer;
    //Quando isLoading se torna true mostra o spinner imediatamente
    if (isLoading) {
      setShouldDisplay(true);
    } else if (shouldDisplay) {
      // Quando isLoading se torna false aguarda pelo menos o minDisplayTime antes de ocultar
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
import { useState, useEffect } from 'react';

export function useAuth() {
  // Estado inicial baseado no localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isLoading, setIsLoading] = useState(true);
  
  //API para verificar autenticação
  const checkAuthentication = async () => {
    try {
      const res = await fetch("http://localhost:3000/check-auth", {
        credentials: "include", 
      });
      
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      localStorage.setItem("isAuthenticated", data.isAuthenticated ? "true" : "false");
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
      localStorage.setItem("isAuthenticated", "false");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Executa a verificação quando o componente é montado
  useEffect(() => {
    checkAuthentication();
  }, []);
  
  // Mantém o localStorage atualizado
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);
  
  return { isAuthenticated, setIsAuthenticated, isLoading };
}
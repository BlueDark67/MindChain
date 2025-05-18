import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../public/js/useAuth";
import Loading from "./components/Loading/Loading";
import AppRoutes from "./AppRoutes.jsx";

function App() {
  //para indicar se o user está autenticado
  const { isAuthenticated, setIsAuthenticated, isLoading } = useAuth();

  return (
    <BrowserRouter>
      {isLoading ? (
        <Loading />
      ) : (
        <AppRoutes 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
        />
      )}
    </BrowserRouter>
  );
}

export default App;
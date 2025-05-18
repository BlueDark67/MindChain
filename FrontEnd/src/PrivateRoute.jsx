import { Outlet, Navigate } from "react-router-dom";

//Se tiver autenticado o user tem permissao de aceder as rotas privadas
//Se não o user é redirecionado para a pagina de login
const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
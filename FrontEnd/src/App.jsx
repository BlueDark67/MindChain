import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useState, useEffect } from "react";
import PersonalData from "../views/UserRelatedPage/Personaldata/PersonalData.jsx";
import HomePage from "../views/HomePage/HomePage.jsx";
import ForgotPassword from "../views/ForgotPassword/ForgotPassword.jsx";
import LoginPage from "../views/LoginPage/LoginPage";
import EmailSent from "../views/EmailSent/EmailSent.jsx";
import ResetPassword from "../views/ResetPassword/ResetPassword.jsx";
import SignUp from "../views/SignUp/SignUp.jsx";
import NotFound from "../views/NotFound/NotFound.jsx"; 
import PrivateRoute from "./PrivateRoute.jsx";
import CreationRoom from "../views/CreationRoom/CreationRoom.jsx";
import InvitePage from "../views/InvitePage/InvitePage.jsx";
import UnlockRoom from "../views/UnlockRoom/UnlockRoom.jsx";

function App(){
    // Estado inicial baseado no localStorage (para carregamento rápido)
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );
    // Novo estado para controlar o carregamento
    const [isLoading, setIsLoading] = useState(true);
    
    // Função para verificar autenticação
    const checkAuthentication = async () => {
        try {
            // Faz a requisição para o endpoint que criamos
            const res = await fetch("http://localhost:3000/check-auth", {
                credentials: "include", // Importante para enviar cookies de sessão
            });
            
            const data = await res.json();
            
            // Atualiza o estado com a resposta do servidor
            setIsAuthenticated(data.isAuthenticated);
            localStorage.setItem("isAuthenticated", data.isAuthenticated ? "true" : "false");
        } catch (error) {
            console.error("Erro ao verificar autenticação:", error);
            // Em caso de erro, considere o usuário como não autenticado
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
        } finally {
            setIsLoading(false); // Termina o carregamento
        }
    };
    
    // Executa a verificação quando o componente é montado
    useEffect(() => {
        checkAuthentication();
    }, []);
    
    // Mantém o localStorage atualizado (já existe no seu código)
    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
    }, [isAuthenticated]);

    // Mostra um indicador de carregamento enquanto verifica
    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return(
        <BrowserRouter>
            <Routes>
                {/*Finalmente alterei a merda de iniciar sempre na pagina de not found*/ }
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/email-sent" element={<EmailSent />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/personal-data" element={<PersonalData />} />
                    <Route path="/create-room" element={<CreationRoom />} />
                    <Route path="/invite/:roomId" element={<InvitePage />} />
                    <Route path="/unlock-room/:roomId" element={<UnlockRoom />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
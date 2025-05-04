import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogOut.css';
import '../../Global.css';

function LogOut({ setIsAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Log Out";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false); // Atualiza o estado global de autenticação
        localStorage.clear(); // Limpa todos os dados do localStorage
        navigate("/login"); // Redireciona para a página de login
    };

    const changePage = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div className="container-wrapperLogout">
            <div className="containerLogout">
                <h1 className="logout">Are you sure you want to log out?</h1>
                <div className="button-container">
                    <button className="cancel-button" onClick={() => changePage("UserPage")}>Cancel</button>
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </div>
    );
}

export default LogOut;
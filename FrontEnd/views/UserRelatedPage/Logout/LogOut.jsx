import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogOut.css';
import '../../Global.css';

function LogOut({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        document.title = "Log Out";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    

    
    const handleLogout = async () => {
        try {
            //comunica com o servidor
            await fetch("http://localhost:3000/logout", {
                method: "GET",
                credentials: "include"
            });

            
            //metes a autenticação a falso senao dá problema
            setIsAuthenticated(false);

            //Aqui limpas o localstorage no navegador do utilizador
            localStorage.setItem("isAuthenticated", "false");

            navigate("/login");
        } catch (err) {
            console.error("Error ao fazer logout:", err);
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            navigate("/login");
        }
    };

    const changePage = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div className="container-wrapperLogout">
            <div className="containerLogout">
                <h1 className="logout">Are you sure you want to log out?</h1>
                <div className="button-container">
                    <button className="cancel-button" onClick={() => changePage(`userpage/${userId}`)}>Cancel</button>
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </div>
    );
}

export default LogOut;
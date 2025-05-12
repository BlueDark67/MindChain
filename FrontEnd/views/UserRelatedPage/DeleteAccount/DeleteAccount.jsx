import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';
import '../../Global.css';


function DeleteAccount({ setIsAuthenticated }) {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Delete Account";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false); // Atualiza o estado global de autenticação
        navigate("/login"); // Redireciona para a página de login
    };

    const changePage = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div className="container-wrapperDeleteAccount">
            <div className="containerDeleteAccount">
                <h1 className="delete">Are you sure you want to delete your account?</h1>
                <p className="deletewarning">This action cannot be undone.</p>
                <div className="button-container">
                    <button className="cancel-button" onClick={() => changePage("UserPage")}>Cancel</button>
                    <button className="delete-button" onClick={handleLogout}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccount;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './DeleteAccount.css';
import '../../Global.css';
import { deleteAccount } from '../../../public/js/DeleteAccount';
import ButtonSimple from '../../../src/components/buttonSimple/buttonSimple.jsx';


function DeleteAccount({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        document.title = "Delete Account";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    const handleConfirmDelete = () => {
        setIsAuthenticated(false); // Atualiza o estado global de autenticação
        deleteAccount(userId) // Chama a função para deletar a conta
        localStorage.clear(); // Limpa o localStorage
        localStorage.setItem("isAuthenticated", "false"); // Atualiza o estado de autenticação no localStorage
        navigate("/login"); // Redireciona para a página de login
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false); // Fecha o modal de confirmação
    };

    const changePage = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div className="container-wrapperDeleteAccount">
            {showDeleteConfirm && (
                <div className="modal-overlay-delete">
                    <div className="modal-confirm-delete">
                        <p>This will erase your account. Are you sure that you want to erase your account? </p>
                        <div className="modal-buttons-delete">
                            <ButtonSimple onClick={handleConfirmDelete} text = "I'm sure, delete" variant="grey_purple" size="w180h47"/>
                            <ButtonSimple onClick={handleCancelDelete} text = "Cancel"  variant="grey_purple" size="w90h47" />
                        </div>
                    </div>
                </div>
            )}
            <div className="containerDeleteAccount">
                <h1 className="delete">Are you sure you want to delete your account?</h1>
                <p className="deletewarning">This action cannot be undone.</p>
                <div className="button-container">
                    <button className="cancel-button" onClick={() => changePage(`userpage/${userId}`)}>Cancel</button>
                    <button className="delete-button" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccount;
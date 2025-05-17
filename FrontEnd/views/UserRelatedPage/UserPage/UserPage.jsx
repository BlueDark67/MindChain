import'./UserPage.css';
import '../../Global.css';
import avatar from '../../../public/avatarfundo.png';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import flag from '../../../public/flag.png';
import { fetchUserName } from '../../../public/js/UserPage';
import { useState } from 'react';
import BackButton from '../../../src/components/backButton/backButton';


function UserPage() {
    const [username, setUsername] = useState("");
    const [subscriptionPlan, setSubscriptionPlan] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
            document.title = "User Page";
            document.body.classList.add('gradient_background_BB');

            fetchUserName(userId).then((data) => {
                if (data){
                    setUsername(data.username);
                    setSubscriptionPlan(data.subscriptionPlan);
                }                
            });

            return () => {
                    document.body.classList.remove('gradient_background_BB');
                }

        }, []);

    

        const navigate = useNavigate();

        const changePage = (page) => {
            navigate(`/${page}`);
        };
        return (
            <div className="container-wrapperuserpage">
                <BackButton customClass="chat-room-back-button" />
                {/* Cabeçalho com avatar, nome e idioma */}
                <div className="headeruserpage">
                    <img className="avataruserpage" src={avatar} alt="profile" />
    
                    <div className="info-box">
                        <div className="usernameuserpage">{username}</div>
                        <div className='usernameuserpage'>Subscription Plan: {subscriptionPlan}</div> 
                        <div className="language">
                        pt <img className="flag" src={flag} alt="flag" />
                        </div>
                    </div>
            </div>
    
                {/* Conteúdo principal com botões e painel */}
                <div className="main-contentuserpage">
                    <div className="button-containeruserpage">
                        <button className="buttonuserpage" onClick={() => changePage("personal-data")}>Personal Data</button>
                        <button className="buttonuserpage" onClick={() => changePage("metrics")}>Metrics</button>
                        <button className="buttonuserpage" onClick={() => changePage("new-password")}>Security</button>
                        <button className="buttonuserpage" onClick={() => changePage("progress")}>Progress</button>
                        <button className="buttonuserpage" onClick={() => changePage("premium")}>Premium</button>
                        <button className="buttonuserpage" onClick={() => changePage("delete-account")}>Delete Account</button>
                        <button className="buttonuserpage" onClick={() => changePage("logout")}>Log Out</button>
                    </div>
                    <div className="content-panel">
                        {/* Conteúdo correspondente à secção selecionada */}
                    </div>
                </div>
            </div>
        );
}
export default UserPage;
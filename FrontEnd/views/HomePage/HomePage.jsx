import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import './HomePage.css';
import '../Global.css';
import Sidebar from '../../src/components/Menu/Menu.jsx';

function InicialPage() {
    useEffect(() => {
        document.title = "HomePage";
        document.body.classList.add('gradient_background_BP');

        return () => {
            document.body.classList.remove('gradient_background_BP');
        }

    }, []);

    const navigate = useNavigate();

    const changePage = ( page) => {
        navigate("/" + page);
    }

    return(
        <div className="home-container">
            <Sidebar />
            <div className="content-container">
                <h1>Create a new chatroom</h1>
                <div className='buttonGroupTop'>
                    <ButtonSimple 
                        onClick={() => changePage("create-room")}  
                        text="Let's unlock ideias connecting your minds" 
                        variant="grey_purple" 
                        size="w830h90" 
                    />
                    <ButtonSimple  
                        text="Use chatroom code" 
                        variant="grey_purple" 
                        size="w830h90"
                    />
                </div>
                <h1>Old Chatrooms</h1>
            </div>
        </div>
    );
}

export default InicialPage;
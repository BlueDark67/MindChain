import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import ButtonChatroom from '../../src/components/buttonChatroom/buttonChatroom.jsx';
import './HomePage.css';
import '../Global.css';
import Sidebar from '../../src/components/Menu/Menu.jsx';
import { fetchHistory } from '../../public/js/HomePage.js';

function InicialPage() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        document.title = "HomePage";

        document.body.classList.add('gradient_background_BP');

        const userID = localStorage.getItem("userId");

        fetchHistory(userID).then((data) => {
            if (data) setRooms(data);
            
        });
        
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
                        variant="purple_dark" 
                        size="w830h90" 
                    />
                    <ButtonSimple  
                        text="Use chatroom code" 
                        variant="purple_dark" 
                        size="w830h90"
                    />
                
                <h1>Old Chatrooms</h1>
                    <div className="chatrooms-scroll-container">
                        {rooms.map((room) => (
                            <ButtonChatroom
                                key={room._id}
                                theme={room.theme}
                                participants={room.users.length}
                                participantsList={room.users.map(u => u.username)}
                                variant="grey_purple"
                                size="w830h90"
                            />
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default InicialPage;
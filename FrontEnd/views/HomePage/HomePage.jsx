import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import ButtonChatroom from '../../src/components/buttonChatroom/buttonChatroom.jsx';
import './HomePage.css';
import '../Global.css';
import Sidebar from '../../src/components/Menu/Menu.jsx';
import { fetchHistory, groupRoomsByDate } from '../../public/js/HomePage.js';

function InicialPage() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        document.title = "HomePage";

        document.body.classList.add('gradient_background_BP', 'allow_scroll');

        const userID = localStorage.getItem("userId");

        fetchHistory(userID).then((data) => {
            if (data) setRooms(data);
            
        });
        
        return () => {
            document.body.classList.remove('gradient_background_BP', 'allow_scroll');
        }
        
    }, []);

    const navigate = useNavigate();

    const changePage = (page) => {
        navigate("/" + page);
    }

    const grouped = groupRoomsByDate(rooms);

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
                        onClick = {() => changePage("unlock-room") }
                        text="Use chatroom code" 
                        variant="purple_dark" 
                        size="w830h90"
                    />
                
                <h1>Old Chatrooms</h1>
                    <div className="chatrooms-scroll-container">
                    {grouped.today.length > 0 && (
                            <>
                                <div><span>Today</span></div>
                                {grouped.today.map(room => (
                                    <ButtonChatroom
                                        key={room._id}
                                        theme={room.theme}
                                        participants={room.users.length}
                                        participantsList={room.users.map(u => u.username)}
                                        variant="grey_purple"
                                        size="w830h90"
                                    />
                                ))}
                            </>
                        )}
                        {grouped.thisWeek.length > 0 && (
                            <>
                                <div><span>This week</span></div>
                                {grouped.thisWeek.map(room => (
                                <ButtonChatroom
                                    key={room._id}
                                    theme={room.theme}
                                    participants={room.users.length}
                                    participantsList={room.users.map(u => u.username)}
                                    variant="grey_purple"
                                    size="w830h90"
                                />
                                ))}
                            </>
                        )}
                        {grouped.lastWeek.length > 0 && (
                            <>
                                <div><span>Last week</span></div>
                                {grouped.lastWeek.map(room => (
                                    <ButtonChatroom
                                        key={room._id}
                                        theme={room.theme}
                                        participants={room.users.length}
                                        participantsList={room.users.map(u => u.username)}
                                        variant="grey_purple"
                                        size="w830h90"
                                    />
                                ))}
                            </>
                        )}
                        {grouped.lastMonth.length > 0 && (
                            <>
                                <div><span>Last month</span></div>
                                {grouped.lastMonth.map(room => (
                                    <ButtonChatroom
                                        key={room._id}
                                        theme={room.theme}
                                        participants={room.users.length}
                                        participantsList={room.users.map(u => u.username)}
                                        variant="grey_purple"
                                        size="w830h90"
                                    />
                                ))}
                            </>
                        )}
                        {Object.entries(grouped.months).map(([month, rooms]) => (
                            <div key={month}>
                                <div><span>{month}</span></div>
                                {rooms.map(room => (
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
                        ))}
                        {Object.entries(grouped.years).map(([year, rooms]) => (
                            <div key={year}>
                                <div><span>{year}</span></div>
                                {rooms.map(room => (
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicialPage;
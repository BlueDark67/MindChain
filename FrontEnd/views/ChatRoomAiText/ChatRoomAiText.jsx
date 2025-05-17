import React, { useEffect } from 'react';
import '../Global.css';
import './ChatRoomAiText.css';
import BackButton from '../../src/components/backButton/backButton';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRoomInfo } from '../../public/js/ChatroomAI.js';



const ChatRoomAiText = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("");
  const { roomId } = useParams();
  const [textContent, setTextContent] = useState(null);

  useEffect(() => {
    document.title = "ChatRoom Final";
    document.body.classList.add('gradient_background_BP');

    fetchRoomInfo(roomId).then((data) => {
      if(data){
        setTheme(data.theme)
        setTextContent(data.text);
        setLoading(false);
      }
    });
    
    return () => {
      document.body.classList.remove('gradient_background_BP');
    }
  }, [roomId]);

  if(loading){
    return (
            <div className="loading-container-chat-ai">
                <div className="spinner-chat-ai"></div>
                <h2>Loading...</h2>
            </div>
        );
  }else{
    return (
      <div className="chat-room-container">
          <BackButton customClass="chat-room-back-button" />

        <h1 className="theme-heading">Theme : {theme}</h1>
        
        <div className="content-box">
                  
          <div className="text-content">
            <p>{textContent}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatRoomAiText;
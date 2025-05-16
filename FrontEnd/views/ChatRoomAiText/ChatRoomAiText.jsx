import React, { useEffect } from 'react';
import '../Global.css';
import './ChatRoomAiText.css';
import BackButton from '../../src/components/backButton/backButton';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateChatResponse, fetchRoomInfo } from '../../public/js/ChatroomAI.js';



const ChatRoomAiText = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("");
  const { roomId } = useParams();

  // Hardcoded content instead of database import
  /*const textContent = [
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "Farm animals play a crucial role in providing food, labor, and companionship to humans. Rabbits, for example, are commonly found on farms, known for their soft fur and quick breeding cycles. While rabbits are often seen as pets, they also contribute to sustainable farming through their efficient manure production, which enriches the soil for crops like carrots. Carrots, being a popular root vegetable, serve as both a nutritious food source for humans and a tasty treat for various farm animals.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "This text was created based on the ideas submitted, which included \"Rabbit,\" \"Carrot,\" \"Food,\" and \"Pig.\" These elements offer a glimpse into the rich and diverse environment of farm life, where animals and agriculture thrive together.",
    "Pigs are another essential part of farm life. Known for their intelligence and adaptability, pigs are valuable in agricultural systems. They consume food scraps, reducing waste, and provide important resources such as meat and leather. On many farms, pigs"
  ];*/
  const [textContent, setTextContent] = useState(null);

  useEffect(() => {
    document.title = "ChatRoom Final";
    document.body.classList.add('gradient_background_BP');

    fetchRoomInfo(roomId).then((data) => {
      if(data){
        setTheme(data.theme);
        if(data.text !== null){
          setTextContent(data.text);
          setLoading(false);
        }else{
          generateChatResponse(roomId).then((response) => {
            if(response){
              setTextContent(response.generatedText);
              setLoading(response.setLoading);
            }
          });
        }
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
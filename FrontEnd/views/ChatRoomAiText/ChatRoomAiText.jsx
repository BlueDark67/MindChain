import React, { useEffect } from 'react';
import './ChatRoomAiText.css';
import BackButton from '../../src/components/backButton/backButton';


const ChatRoomAiText = () => {
  // Hardcoded content instead of database import
  const theme = "Farm animals";
  const title = "Exploring Farm Animals: Inspired by Shared Ideas";
  const textContent = [
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
  ];

  useEffect(() => {
    document.title = "ChatRoom Final";
    document.body.classList.add('gradient_background_BP');
    
    return () => {
      document.body.classList.remove('gradient_background_BP');
    }
  }, []);

  return (
    <div className="chat-room-container">
        <BackButton customClass="chat-room-back-button" />

      <h1 className="theme-heading">Theme : {theme}</h1>
      
      <div className="content-box">
        <h2 className="title">Title: {title}</h2>
        
        <div className="text-content">
          {textContent.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomAiText;
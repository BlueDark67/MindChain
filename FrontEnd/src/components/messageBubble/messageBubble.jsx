import React from 'react';
import './MessageBubble.css';

//Componente de mensagens que é usado na pagina de chatroom para os utilizadores mandarem msg
//Cada user vai chamar a componente quando escreve
const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <div className={`message-bubble ${isCurrentUser ? 'own-message' : 'other-message'}`}>
      <div className="message-header">
        <span className="message-user">{message.user?.username}</span>
        <span className="message-time">{message.timestamp || message.createAt}</span>
      </div>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
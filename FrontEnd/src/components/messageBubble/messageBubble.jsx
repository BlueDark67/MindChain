import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <div className={`message-bubble ${isCurrentUser ? 'own-message' : 'other-message'}`}>
      <div className="message-header">
        <span className="message-user">{message.user}</span>
        <span className="message-time">{message.timestamp}</span>
      </div>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
import React, { useState, useEffect } from "react";
import "./Chatroom.css";
import '../Global.css';
import MessageBubble from "../../src/components/messageBubble/messageBubble.jsx";

const Chatroom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10);
    const [theme, setTheme] = useState("Farm Animals");
    const currentUser = "User1"; // This could come from authentication context
    
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };
    
    const handleSendMessage = () => {
        if (message.trim() !== "") {
            const newMessage = {
                id: Date.now(),
                text: message,
                user: "User1",
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages([...messages, newMessage]);
            setMessage("");
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };
    
    useEffect(() => {
        // On first mount, initialize the timer
        if (!localStorage.getItem("timerEndTime")) {
            const endTime = Date.now() + (timeLeft * 1000);
            localStorage.setItem("timerEndTime", endTime.toString());
        }
    
        // Calculate remaining time based on stored end time
        const calculateTimeRemaining = () => {
            const endTime = localStorage.getItem("timerEndTime");
            if (!endTime) return 0;
            
            const remaining = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
            return remaining;
        };
    
        // Set initial remaining time
        setTimeLeft(calculateTimeRemaining());
        
        // Update timer every second
        const timer = setInterval(() => {
            const remaining = calculateTimeRemaining();
            
            if (remaining <= 0) {
                clearInterval(timer);
                localStorage.removeItem("timerEndTime"); // Clear timer when done
            }
            
            setTimeLeft(remaining);
        }, 1000);
        
        return () => clearInterval(timer);
    }, []); // Empty dependency array means this runs once on mount

    
    
    useEffect(() => {
        document.title = "Chat Room";
        document.body.classList.add('gradient_background_BP');
        
        return () => {
            document.body.classList.remove('gradient_background_BP');
        };
    }, []);

    return (
        <div className="page-container">
            <div className="header-section">
                <h1 className="theme-title">Theme: {theme}</h1>
                <div className="timer">Time left: {timeLeft} s</div>
            </div>
            
            {/* Messages container separated from input area */}
            <div className="chatroom-container">
                <div className="messages-container">
                    {messages.length === 0 ? (
                        <p className="no-messages">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((msg) => (
                            <MessageBubble 
                                key={msg.id} 
                                message={msg} 
                                isCurrentUser={msg.user === currentUser}
                            />
                        ))
                    )}
                </div>
            </div>
            
            {/* Input area as a separate component */}
            <div className="input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Drop here your ideas..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                />
                <button 
                    className="send-button"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatroom;
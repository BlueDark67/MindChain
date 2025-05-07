import React, { useState, useEffect, useRef } from "react";
import "./Chatroom.css";
import '../Global.css';
import MessageBubble from "../../src/components/messageBubble/messageBubble";
import Button from "../../src/components/button/Button";

const Chatroom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10);
    const [theme, setTheme] = useState("Farm Animals");
    const currentUser = "User1";
    
    // Trocar a referência do elemento final para o container de mensagens
    const messagesContainerRef = useRef(null);
    
    // Função para fazer scroll até o final usando scrollTop em vez de scrollIntoView
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };
    
    // UseEffect para scroll quando mensagens mudam
    useEffect(() => {
        setTimeout(scrollToBottom, 10); // Pequeno atraso para garantir renderização completa
    }, [messages]);
    
    // Suas funções existentes...
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
            
            <div className="chatroom-container">
                {/* Aplicar a ref ao container de mensagens, não a um elemento no final */}
                <div className="messages-container" ref={messagesContainerRef}>
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
                    {/* Não é mais necessário div adicional no final */}
                </div>
            </div>
            
            {/* Input area */}
            <div className="input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Drop here your ideas..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                />
                <Button 
                    className="send-button"
                    onClick={handleSendMessage}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default Chatroom;
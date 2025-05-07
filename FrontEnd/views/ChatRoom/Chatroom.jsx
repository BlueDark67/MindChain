import React, { useState, useEffect, useRef, use } from "react";
import { useParams } from "react-router-dom";
import "./Chatroom.css";
import '../Global.css';
import MessageBubble from "../../src/components/messageBubble/messageBubble";
import Button from "../../src/components/button/Button";
import { fetchRoomInfo } from "../../public/js/Chatroom.js";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000")

const Chatroom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [timeLeft, setTimeLeft] = useState();
    const [theme, setTheme] = useState("");
    
    const userId = localStorage.getItem("userId");
    const roomId = useParams().roomId;
    //const currentUser = "User1";
    
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
    
    const handleErros = (res) => {
        if (!res.ok) {
            throw Error(res.status + " - " + res.url);
        }
        return res;
      };
    
    const requestBody = {userId: userId, roomId: roomId, content: message};

    const handleSendMessage = async (e) => {
        /*if (message.trim() !== "") {
            const newMessage = {
                id: Date.now(),
                text: message,
                user: "User1",
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages([...messages, newMessage]);
            setMessage("");
        }*/

            e.preventDefault();
            try {
                const res = await fetch("http://localhost:3000/save-message",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });
                handleErros(res);

                socket.emit("sendMessage", {
                    roomId: roomId,
                    content: message,
                    userId: userId
                });

                setMessage("");

              } catch (err) {
                console.error(err);
              }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    useEffect(() => {
        document.title = "Chat Room";
        document.body.classList.add('gradient_background_BP');

        fetchRoomInfo(roomId).then((data) => {
            if(data){
                setTheme(data.theme);
                setTimeLeft(Number(data.time));
            }else{
                console.error("Error fetching room info - no data");
            }
        });
        
        return () => {
            document.body.classList.remove('gradient_background_BP');
        };
    }, []);
    
    useEffect(() => {
        if(timeLeft === undefined) return; // Exit if timeLeft is not set

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
        socket.emit("joinRoom", roomId);
        
        socket.on("clientChat", (data) => {
            const newMessage = {
                id: Date.now(),
                content: data.content,
                userId: data.userId,
                user: data.username,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off("clientChat");
            socket.emit("leaveRoom", roomId);
        }
    }, [roomId]); 

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
                                message ={msg}
                                isCurrentUser={msg.userId === userId}// Assuming userId is the current user's ID
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
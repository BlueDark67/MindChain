import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Chatroom.css";
import '../Global.css';
import MessageBubble from "../../src/components/messageBubble/messageBubble";
import ButtonSimple from "../../src/components/buttonSimple/ButtonSimple";
import Button from "../../src/components/button/Button";
import { fetchRoomInfo } from "../../public/js/Chatroom.js";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000")

const Chatroom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [timeLeft, setTimeLeft] = useState();
    const [theme, setTheme] = useState("");
    const [isCreator, setIsCreator] = useState(false);
    const [endTime, setEndTime] = useState(null);
    const[time, setTime] = useState(null);
    const [preCountdown, setPreCountdown] = useState(null);
    const [canSend, setCanSend] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [chatStarted, setChatStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const userId = localStorage.getItem("userId");
    const roomId = useParams().roomId;
    
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
        e.preventDefault();
        if (!message.trim()) return;
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
                setTime(Number(data.time));
                setTimeLeft(Number(data.time));
                if(data.users[0]._id === userId){
                    setIsCreator(true);
                }
                if (Number(data.time) === -1) {
                    setElapsedTime(0);
                }
            
            }else{
                console.error("Error fetching room info - no data");
            }
             setLoading(false);
        });
        
        return () => {
            document.body.classList.remove('gradient_background_BP');
        };
    }, [roomId]);

    useEffect(() => {
        let interval;
        if (chatStarted && time === -1) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [chatStarted, time]);

    useEffect(() => {
        function handleChatStarted({ start, duration }) {
            setCanSend(false);
            if (duration === -1) {
                setElapsedTime(0);
                setChatStarted(true);
            } else {
                setEndTime(start + duration * 1000);
                setTimeLeft(duration);
                setChatStarted(false);
            }
        }

        socket.on("chatStarted", handleChatStarted);

        return () => {
            socket.off("chatStarted", handleChatStarted);
        };
    }, [socket]);
    
    useEffect(() => {
        if (!endTime) return;
    
        const interval = setInterval(() => {
            const now = Date.now();
            const secondsLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
            setTimeLeft(secondsLeft);
            if (secondsLeft <= 0) clearInterval(interval);
        }, 1000);
    
        return () => clearInterval(interval);
    }, [endTime]);
    

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

    const startChat = () => {
        socket.emit("startPreCountdown", { roomId }); 
    };

    useEffect(() => {
        function handlePreCountdown() {
            setPreCountdown(5);
            let count = 5;
            const interval = setInterval(() => {
                count -= 1;
                setPreCountdown(count);
                if (count === 0) {
                    clearInterval(interval);
                    setPreCountdown(null);
                    setCanSend(false);
                    if (isCreator) {
                    const start = Date.now();
                    socket.emit("startChatNow", { roomId, start, duration: time });
                }
                }
            }, 1000);
        }

        socket.on("preCountdown", handlePreCountdown);

        return () => {
            socket.off("preCountdown", handlePreCountdown);
        };
    }, [time, isCreator, roomId, socket]);

    useEffect(() => {
        function handleChatStarted({ start, duration }) {
            setCanSend(false);
            setEndTime(start + duration * 1000);
            setTimeLeft(duration);
        }

        socket.on("chatStarted", handleChatStarted);

        return () => {
            socket.off("chatStarted", handleChatStarted);
        };
    }, [socket]);

    function getStartStopText() {
        if (time === -1) {
            // Ilimitado: se o chat já começou, mostra Stop, senão Start
            return chatStarted ? "Stop" : "Start";
        } else {
            // Limitado: sempre Start
            return "Start";
        }
    }

    if(loading){
        return (
            <div className="loading-container-chat">
                <div className="spinner-chat"></div>
                <h2>Loading...</h2>
            </div>
        );
    }else{
        return (
            <div className="page-container">
                <div className="header-section">
                    <h1 className="theme-title">Theme: {theme}</h1>
                    <div className={isCreator ? "creator-container" : "non-creator-container"}>
                        <div className="timer">
                            {time === -1
                                ? `Elapsed time: ${Math.floor(elapsedTime / 60)
                                    .toString()
                                    .padStart(2, '0')}:${(elapsedTime % 60)
                                    .toString()
                                    .padStart(2, '0')} min`
                                : `Time left: ${timeLeft} s`}
                        </div>
                        {isCreator && (
                            (time === -1 || canSend) && (
                                <ButtonSimple
                                    onClick={startChat}
                                    text={getStartStopText()}
                                    variant="grey_purple"
                                    size="w90h47"
                                />
                            )
                        )}
                    </div>  
                </div>

                <div className="chatroom-container">
                    {/* Aplicar a ref ao container de mensagens, não a um elemento no final */}
                    <div className="messages-container" ref={messagesContainerRef}>
                        {preCountdown !== null ? (
                            <div className="pre-countdown">
                                <h2>{preCountdown}</h2>
                            </div>
                        ) : messages.length === 0 ? (
                            (isCreator && canSend)
                                ? <p className="no-messages">Press start to begin the conversation!</p>
                                : <p className="no-messages">No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map((msg) => (
                                <MessageBubble 
                                    key={msg.id} 
                                    message={msg}
                                    isCurrentUser={msg.userId === userId}
                                />
                            ))
                        )}
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
                        disabled={canSend}
                    />
                    <Button 
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={canSend}
                    >
                        Send
                    </Button>
                </div>
            </div>
        );
    }
};

export default Chatroom;
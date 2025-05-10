import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Chatroom.css";
import '../Global.css';
import MessageBubble from "../../src/components/messageBubble/messageBubble";
import ButtonSimple from "../../src/components/buttonSimple/ButtonSimple";
import Button from "../../src/components/button/Button";
import { fetchMessages, fetchRoomInfo, restartRoom } from "../../public/js/Chatroom.js";
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
    const [chatSynced, setChatSynced] = useState(false);
    const [pausedTime, setPausedTime] = useState(null);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);
    const [information, setInformation] = useState(null);
    
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
                //setTimeLeft(Number(data.time));
                if(data.users[0]._id === userId){
                    setIsCreator(true);
                }      
                fetchMessages(roomId).then((messagesData) => {
                    if(messagesData){
                        const formattedMessages = messagesData.map(msg => ({
                            ...msg,
                            timestamp: msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString()
                                : ""
                        }));
                        setMessages(formattedMessages);
                    }else{
                        console.error("Error fetching messages - no data");
                    }
                });
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
        if (time === -1) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [time]);

    useEffect(() => {
        function handleChatStarted({ start, duration }) {
            setCanSend(false);
            if (duration === -1) {
                const elapsed = Math.floor((Date.now() - start) / 1000);
                setElapsedTime(elapsed >= 0 ? elapsed : 0);
                setChatStarted(true);
            } else {
                const end = start + duration * 1000;
                setEndTime(end);
                const secondsLeft = Math.max(0, Math.ceil((end - Date.now()) / 1000));
                setTimeLeft(secondsLeft);
                setChatStarted(true);
            }
            setChatSynced(true);
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
            if (secondsLeft <= 0){
                clearInterval(interval)
                setChatStarted(false);
                setCanSend(true);
                socket.emit("stopChat", { roomId });
            };
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
                user: { username: data.username, _id: data.userId },
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

    function handleStopChat() {
        setChatStarted(false);
        setCanSend(true);
        setPausedTime(true);
        socket.emit("stopChat", { roomId });
    }

    function handleContinueChat() {
            setCanSend(false);
            setChatStarted(true);
            setPausedTime(null);
            socket.emit("continueChat", { roomId });
    }

    useEffect(() => {
        function handleChatContinued() {
            setCanSend(false);
            setChatStarted(true);
            setPausedTime(null);
        }
        socket.on("chatContinued", handleChatContinued);
        return () => socket.off("chatContinued", handleChatContinued);
    }, []);

    useEffect(() => {
        function handleChatStopped() {
            setChatStarted(false);
            setCanSend(true); // true para bloquear input (input está disabled={canSend})
            setEndTime(null);
            setTimeLeft(0);
        }

        socket.on("chatStopped", handleChatStopped);

        return () => {
            socket.off("chatStopped", handleChatStopped);
        };
    }, []);

    const handleRestart = () => {
        setShowRestartConfirm(true);
    };

    const handleCancelRestart = () => {
        setShowRestartConfirm(false);
    }

    const handleConfirmRestart = () => {
        setLoading(true);
        setShowRestartConfirm(false);
        setMessages([]);
        setElapsedTime(0);
        setChatStarted(false);
        setPausedTime(null); 
        setCanSend(true);
        setChatSynced(false);
        restartRoom(roomId)
            .then((data) => {
                if (data && data.deleted) {
                    socket.emit("restartRoom", { roomId });
                    setLoading(false);
                    setInformation(true);
                    socket.emit("showResetInfo", { roomId });
                    setTimeout(() => setInformation(false), 3000);

                } else {
                    console.error("Error restarting room - no data");
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error restarting room:", error);
            });
    }

    useEffect(() => {
        function handleShowResetInfo() {
            setInformation(true);
            setTimeout(() => setInformation(false), 3000); // ou o tempo que quiseres
        }
        socket.on("showResetInfo", handleShowResetInfo);
        return () => socket.off("showResetInfo", handleShowResetInfo);
    }, []);

    useEffect(() => {
        function handleRoomRestarted() {
            setMessages([]);
            setElapsedTime(0);
            setChatStarted(false);
            setPausedTime(null);
            setCanSend(true);
            setChatSynced(false);
            setEndTime(null);
            setShowRestartConfirm(false);
        }
        socket.on("roomRestarted", handleRoomRestarted);
        return () => socket.off("roomRestarted", handleRoomRestarted);
    }, []);

    if(loading){
        return (
            <div className="loading-container-chat">
                <div className="spinner-chat"></div>
                <h2>Loading...</h2>
            </div>
        );
    }else if (information) {
        return (
            <div className="loading-container-chat">
                <div className="spinner-chat"></div>
                <h2>Reset in progress: all content will be erased</h2>
            </div>
        );
    }else{
        return (
            <div className="page-container">
                <div className="header-section">
                    <h1 className="theme-title">Theme: {theme}</h1>
                    <div className={isCreator ? "creator-container" : "non-creator-container"}>
                        <div className="timer">
                            {chatSynced ? (
                                time === -1
                                    ? `Elapsed time: ${Math.floor(elapsedTime / 60)
                                        .toString()
                                        .padStart(2, '0')}:${(elapsedTime % 60)
                                        .toString()
                                        .padStart(2, '0')} min`
                                    : `Time left: ${timeLeft} s`
                            ) : (
                                time === -1
                                    ? `Elapsed time: 00:00 min`
                                    : `Time left: ${time} s`
                            )}
                        </div>
                        {isCreator && (
                            <>
                                {!chatStarted && !pausedTime && (
                                    <ButtonSimple
                                        onClick={startChat}
                                        text="Start"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}

                                {/* Botão Stop: só aparece quando o chat está a decorrer */}
                                {time === -1 && chatStarted && (
                                    <ButtonSimple
                                        onClick={handleStopChat}
                                        text="Stop"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}

                                {/* Botão Continue aparece quando chat está parado, há tempo restante e não está em modo ilimitado */}
                                {time === -1 && !chatStarted && pausedTime && (
                                    <ButtonSimple
                                        onClick={handleContinueChat}
                                        text="Continue"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}

                                {/* Botão Restart (opcional) */}
                                {time === -1 && !chatStarted && (canSend ||pausedTime) && (
                                    <ButtonSimple
                                        onClick={handleRestart}
                                        text="Restart"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}

                                {time === -1 && !chatStarted && (canSend || pausedTime) && (
                                    <ButtonSimple
                                        text="Finish"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}
                            </>
                        )}
                    </div>  
                </div>

                <div className="chatroom-container">
                    {showRestartConfirm && (
                        <div className="modal-overlay">
                            <div className="modal-confirm">
                                <p>This will erase the chatroom history. Are you sure that you want to restart the room? </p>
                                <div className="modal-buttons">
                                    <ButtonSimple onClick={handleConfirmRestart} text = "I'm sure, restart" variant="grey_purple" size="w180h47"/>
                                    <ButtonSimple onClick={handleCancelRestart} text = "Cancel"  variant="grey_purple" size="w90h47" />
                                </div>
                            </div>
                        </div>
                    )}
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
                                    key={msg.id || msg._id} 
                                    message={msg}
                                    isCurrentUser={(msg.user && String(msg.user._id) === String(userId)) ||
                                                    (msg.userId && String(msg.userId) === String(userId)) ||
                                                    (msg.userId === userId)}
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
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Chatroom.css";
import '../Global.css';
import MessageBubble from "../../src/components/messageBubble/messageBubble";
import ButtonSimple from "../../src/components/buttonSimple/buttonSimple.jsx";
import Button from "../../src/components/button/Button";
import BackButton from "../../src/components/backButton/backButton.jsx";
import { fetchMessages, fetchRoomInfo, restartRoom } from "../../public/js/Chatroom.js";
import { io } from "socket.io-client";
import { generateChatResponse } from "../../public/js/Chatroom.js"; 


const socket = io("ws://localhost:3000")

const Chatroom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [timeLeft, setTimeLeft] = useState();
    const [theme, setTheme] = useState("");
    const [isCreator, setIsCreator] = useState(false);
    const [endTime, setEndTime] = useState(null);
    const [time, setTime] = useState(null);
    const [preCountdown, setPreCountdown] = useState(null);
    const [canSend, setCanSend] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [chatStarted, setChatStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chatSynced, setChatSynced] = useState(false);
    const [pausedTime, setPausedTime] = useState(null);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);
    const [information, setInformation] = useState(null);
    const [showUserTooltip, setShowUserTooltip] = useState(false);
    const [allUsers, setAllUsers] = useState([]); 
    const [activeUsers, setActiveUsers] = useState([]); 
    const [haveFinished, setHaveFinished] = useState(false);
    const [elapsedTimeDB, setElapsedTimeDB] = useState(0);
    const [redirecting, setRedirecting] = useState(false);
    
    const userId = localStorage.getItem("userId");
    const roomId = useParams().roomId;
    
    
    const messagesContainerRef = useRef(null);

    const navigate = useNavigate();

    const changePage = (page) => {
        navigate("/" + page);
    }

    
    // Função para fazer scroll até o final 
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };
    
    // UseEffect para scroll quando mensagens mudam 
    useEffect(() => {
        setTimeout(scrollToBottom, 10); // Pequeno atraso para garantir a renderização completa
    }, [messages]);
    
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

    //API para guardar mensagens
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
    
    // Função para dar input com o "ENTER"
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(e);
        }
    };


    useEffect(() => {
        document.title = "Chat Room";
        document.body.classList.add('gradient_background_BP');

        //API para buscar informações da sala
        fetchRoomInfo(roomId).then((data) => {
            if(data){
                setTheme(data.theme);
                setTime(Number(data.time));
                setAllUsers(data.users);
                if(data.users[0]._id === userId){
                    setIsCreator(true);
                }
                setHaveFinished(!data.isActive);
                if (!data.isActive && data.timeOfSession !== 0) {
                    setElapsedTimeDB(data.timeOfSession);
                    setCanSend(true);
                }      
                //API para buscar mensagens
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

    //UseEffect para lidar com o tempo decorrido
    useEffect(() => {
        let interval;
        // Só inicia o timer se o tempo for ilimitado, a sala não tiver terminado e não houver timeOfSession guardado
        if (time === -1 && !haveFinished && elapsedTimeDB === 0) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [time, haveFinished, elapsedTime]);

    // UseEffect para lidar com o tempo decorrido quando a sala já tiver terminado
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
    

    // UseEffect para lidar com o tempo restante
    useEffect(() => {
        if (!endTime) return;
    
        const interval = setInterval(async () => {
            const now = Date.now();
            const secondsLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
            setTimeLeft(secondsLeft);
            if (secondsLeft <= 0){
                clearInterval(interval)
                setChatStarted(false);
                setCanSend(true);
                socket.emit("stopChat", { roomId });
                if(isCreator && !haveFinished){
                    await generateChatResponse(roomId);
                    socket.emit("finishRoom", { roomId, elapsedTime: time});
                }
            };
        }, 1000);
    
        return () => clearInterval(interval);
    }, [endTime]);
    

    // UseEffect para lidar com a entrda de utilizador para entrar na sala
    useEffect(() => {
        socket.emit("joinRoom", { roomId, userId: userId });
        
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

    //Função para iniciar o countdown
    const startChat = () => {
        socket.emit("startPreCountdown", { roomId }); 
    };

    //UseEffect para lidar com o countdown e para iniciar o chat
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

    //Função para parar o chat
    function handleStopChat() {
        setChatStarted(false);
        setCanSend(true);
        setPausedTime(true);
        socket.emit("stopChat", { roomId });
    }

    //Função para continuar o chat
    function handleContinueChat() {
            setCanSend(false);
            setChatStarted(true);
            setPausedTime(null);
            socket.emit("continueChat", { roomId });
    }

    // UseEffect para lidar com o chat continuado
    useEffect(() => {
        function handleChatContinued() {
            setCanSend(false);
            setChatStarted(true);
            setPausedTime(null);
        }
        socket.on("chatContinued", handleChatContinued);
        return () => socket.off("chatContinued", handleChatContinued);
    }, []);

    // UseEffect para lidar com o chat parado
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

    // Função para lidar com o botão de reiniciar
    const handleRestart = () => {
        setShowRestartConfirm(true);
    };

    // Função para lidar com o cancelamento do reinício
    const handleCancelRestart = () => {
        setShowRestartConfirm(false);
    }

    // Função para lidar com a confirmação do reinício
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

    // UseEffect para lidar com a informação de reinício
    useEffect(() => {
        function handleShowResetInfo() {
            setInformation(true);
            setTimeout(() => setInformation(false), 3000); // ou o tempo que quiseres
        }
        socket.on("showResetInfo", handleShowResetInfo);
        return () => socket.off("showResetInfo", handleShowResetInfo);
    }, []);

    // UseEffect para lidar com o reinício da sala
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

    // UseEffect para lidar com os utilizadores ativos
    useEffect(() => {
        socket.on("activeUsers", (users) => {
            setActiveUsers(users);
        });
        return () => socket.off("activeUsers");
    }, []);

    // UseEffect para lidar com o redirecionamento para a página de texto gerado
    useEffect(() => {
        function handleRedirect({roomId}){

            setRedirecting(true);
            setTimeout(() => {
                changePage(`chatroom-aitext/${roomId}`);
            }, 2000);
        }
    socket.on("redirectToAiText", handleRedirect);
    return () => socket.off("redirectToAiText", handleRedirect);
    }, [changePage]);


    // Função para lidar com o redirecionamento
    const handleRedirect = async () => {
        if(isCreator && !haveFinished){
            if(time === -1){
                await generateChatResponse(roomId)
                socket.emit("finishRoom", { roomId, elapsedTime: elapsedTime });
            }else{
                await generateChatResponse(roomId)
                socket.emit("finishRoom", { roomId, elapsedTime: time });
            }
        }else if(haveFinished){
            changePage(`chatroom-aitext/${roomId}`);
        }
    }

    if(loading || redirecting){
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
                <BackButton customClass="chat-room-back-button" />
                <div className="user-on-page-tooltip" onClick={() => setShowUserTooltip(!showUserTooltip)}>
                    {activeUsers.length}/{allUsers.length} 
                    {showUserTooltip && 
                    <div className="user-tooltip"><strong>Participantes:</strong>
                        <ul>
                            {allUsers.map(u => {
                                const isActive = activeUsers.some(a => String(a._id) === String(u._id));
                                const isCreatorUser = String(u._id) === String(allUsers[0]._id);
                                return (
                                    <li
                                        key={u._id}
                                        className={isActive ? "user-active" : "user-inactive"}
                                    >
                                        {u.username}{isCreatorUser && " (C)"}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>}
                </div>

                <div className="header-section">
                    <h1 className="theme-title">Theme: {theme}</h1>
                    <div className={isCreator ? "creator-container" : "non-creator-container"}>
                        <div className="timer">
                            {haveFinished ? (
                                `Elapsed time: ${Math.floor(elapsedTimeDB / 60).toString().padStart(2, '0')}:${(elapsedTimeDB % 60).toString().padStart(2, '0')} min`
                            ) : chatSynced ? (
                                time === -1
                                    ? `Elapsed time: ${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')} min`
                                    : `Time left: ${timeLeft} s`
                            ) : (
                                time === -1
                                    ? `Elapsed time: 00:00 min`
                                    : `Time left: ${time} s`
                            )}
                        </div>
                        {isCreator && (
                            <>
                                {!chatStarted && !pausedTime && !haveFinished &&(
                                    <ButtonSimple
                                        onClick={startChat}
                                        text="Start"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}

                                {/* Botão Stop: só aparece quando o chat está a decorrer */}
                                {time === -1 && chatStarted && !haveFinished && (
                                    <ButtonSimple
                                        onClick={handleStopChat}
                                        text="Stop"
                                        variant="grey_purple"
                                        size="w90h47"
                                    />
                                )}

                                {/* Botão Continue aparece quando chat está parado, há tempo restante e não está em modo ilimitado */}
                                {time === -1 && !chatStarted && pausedTime && !haveFinished && (
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

                                {time === -1 && !chatStarted && (canSend || pausedTime)&& !haveFinished && (
                                    <ButtonSimple
                                        text="Finish"
                                        variant="grey_purple"
                                        size="w90h47"
                                        onClick={handleRedirect}
                                    />
                                )}

                                
                            </>
                        )}

                        {haveFinished &&(
                                    <ButtonSimple
                                        text="Show AI text"
                                        variant="grey_purple"
                                        size="w150h47"
                                        onClick={handleRedirect}
                                    />
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
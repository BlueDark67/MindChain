import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Clipboard from "../../public/Clipboard.png";
import ButtonSimple from "../../src/components/buttonSimple/buttonSimple";
import "./InvitePage.css"
import "../Global.css"
import Sidebar from '../../src/components/Menu/Menu.jsx';


function InvitePage(){
    const { roomId } = useParams();
    const [roomCode, setRoomCode] = useState("");
    const [isEmailAdded, setEmailAdded] = useState(false);
    const [email, setEmail] = useState("");
    const [emails, setEmails] = useState([]);
    const [isCopied, setIsCopied] = useState(false);

    const requestBody = {
        emails: emails,
        roomId: roomId,
    }

    useEffect(() => {
              document.title = "Invite";
              document.body.classList.add('gradient_background_BP');
      
              return () => {
                document.body.classList.remove('gradient_background_BP');
              }
      }, []);

      useEffect(() => {
        async function fetchRoomCode() {
          try {
            const res = await fetch(`http://localhost:3000/room-code/${roomId}`);
            const data = await res.json();
            setRoomCode(data.code);
          } catch (error) {
            console.error(error);
          }
        }
        if (roomId) {
          fetchRoomCode();
        }
      }, [roomId]);

    const handleInputChange = (e) => {
        setEmail(e.target.value);

    };

    const handleKeyDown = (e) =>{
        if (e.key === "Enter") {
            e.preventDefault();
            if (email.trim() !== "") {
              setEmails((prevEmails) => [...prevEmails, email.trim()]);
              setEmail("");
              setEmailAdded(true);
            }
        }
    };

    const copyRoomCodeToClipboard = () => {
        navigator.clipboard.writeText(roomCode)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 2000); // exibe a mensagem por 2 segundos
          })
          .catch((err) => {
            console.error("Erro ao copiar: ", err);
          });
    };

    const handleErros = (res) => {
        if (!res.ok) {
            throw Error(res.status + " - " + res.url);
        }
        return res;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/sendEmailInviteRoom",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(requestBody),
                
            });
            handleErros(res);
          } catch (err) {
            console.error(err);
          }
    };

    const navigate = useNavigate();

    const changePage = ( page) => {
        navigate("/" + page);
    }


    return(
      <div>
        <Sidebar/>
        <div className="center-invite">
            <h1>Invite your friends or colleagues to brainstorm</h1>
            <h2>Invite by email or give them the code</h2>
            <form className="form-invite" method="POST" onSubmit={handleSubmit}>
                <label className="label-invite">
                    Add your friend's or colleague's email
                    <br/>       
                    <input className="input-invite" type="text" placeholder="Email" onChange={handleInputChange} onKeyDown={handleKeyDown} />
                </label>
                {isEmailAdded &&
                    <div className="emails-container">
                        <div className="box-invite">
                        <h3>Emails Added:</h3>
                            <ul>
                                {emails.map((em, index) => (
                                <li key={index}>{em}</li>
                                ))}
                            </ul>
                        </div>
                        <ButtonSimple text="Send" variant = "grey_purple" size = "w250h50"/>
                    </div>
                }
            </form>
            <div className="code-invite">
                <div className="code-content">
                    <p>{roomCode}</p>
                    {isCopied && <span className="copied-msg">Copied!</span>}
                </div>
                <img src={Clipboard} alt="Clipboard" className="clipboard-img" onClick={copyRoomCodeToClipboard} />
            </div>
            <ButtonSimple text="Enter session room" variant ="grey_purple" size = "w400h90" 
            onClick={() => changePage(`chatroom/${roomId}`)} />
        </div>       
      </div>

    );
}

export default InvitePage;
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ButtonSimple from "../../src/components/buttonSimple/buttonSimple";
import "./UnlockRoom.css";
import "../Global.css";
import Sidebar from '../../src/components/Menu/Menu.jsx';


function UnlockRoom(){
    const [isPrivate, setIsPrivate] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [code, setCode] = useState("");
    const { roomId } = useParams();

    const requestBody = {
        code:code,
        password: passwordValue,
        roomId: roomId,
    }

    useEffect(() => {
                  document.title = "Invite";
                  document.body.classList.add('gradient_background_BP');
          
                  return () => {
                    document.body.classList.remove('gradient_background_BP');
                  }
          }, []);

          const handleErros = (res) => {
            if (!res.ok) {
                throw Error(res.status + " - " + res.url);
            }
            return res;
          };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await fetch("http://localhost:3000/enter-room",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(requestBody),
                    
                });
                handleErros(res);
                const json = await res.json();
                setIsPrivate(json.isPrivate);
                if(!json.isPrivate){
                    changePage(json.view);
                }
              } catch (err) {
                console.error(err);
              }
        };

    const handleCodeInputChange = (e) =>{
        setCode(e.target.value);
    };

    const handlePasswordInputChange = (e) =>{
        setPasswordValue(e.target.value);
    };

    const navigate = useNavigate();
    
    const changePage = ( page) => {
        navigate("/" + page);
    }

    return(
        <div>
            <Sidebar/>
            <div className="center">
                <form className="unlockroom-form" method="POST" onSubmit={handleSubmit}>
                    <label className="unlockroom-label">
                        Use the code to enter the room
                        </label>
                        <br/>
                        <input type="text" className="unlockroom-input" placeholder="CODE" onChange={handleCodeInputChange} />
                        {isPrivate && 
                            (<div>
                                <label className="unlockroom-label">
                                    This is room is private
                                </label>
                                <br />
                                <input type="text" className="unlockroom-input" placeholder="Password" onChange={handlePasswordInputChange} />
                            </div>)
                        }
                        <ButtonSimple text = "Enter the room" variant = "grey_purple" size = "w400h90" />
                    
                </form>
            </div>
        </div>
    );
}

export default UnlockRoom;
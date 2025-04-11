import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../../src/components/switch/switch";
import ButtonSimple from "../../src/components/buttonSimple/buttonSimple";
import './CreationRoom.css';
import '../Global.css';


function CreationRoom() {
  const [themeValue, setThemeValue] = useState("");
  const [isThemeChosen, setIsThemeChosen] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [sessionTime, setSessionTime] = useState("");

  useEffect(() => {
          document.title = "Forgot Password";
          document.body.classList.add('gradient_background_BP');
  
          return () => {
              document.body.classList.remove('gradient_background_BP');
          }
  }, []);

  const requestBody ={
    themeValue, isThemeChosen, passwordValue, isPrivate, sessionTime
  }

  const navigate = useNavigate();

  const changePage = ( page) => {
    navigate("/" + page);
  }
  
  const handleErros = (res) => {
    if (!res.ok) {
      throw Error(res.status + " - " + res.url);
    }
    return res;
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
      });
      handleErros(res);
      const json = await res.json();
      changePage(json.view);
    } catch (err) {
      console.error(err);
    }
  }
      
  return (
    <div>
      <h1>Creation Room</h1>
      <form className="creation-room-form-inputs" method="POST" onSubmit={handleSubmit}>
        <div className="creation-room-form">
        <Switch labelSwitch="Is the theme choosen by the creator?"
          labelInput="What is the theme?"
          placeholder="Theme"
          onSwitchChange={(checked) => setIsThemeChosen(checked)}
          onInputChange={(themeValue) => setThemeValue(themeValue)}
        />
        <label>
          How much time is the session?
          <select className="creation-room-select" onChange={(e) => setSessionTime(e.target.value)} value={sessionTime}>
            <option value = "" disabled>Select an Option</option>
            <option value="20">20 seconds</option>
            <option value="30">30 seconds</option>
            <option value="40">40 seconds</option>
            <option value="50">50 seconds</option>
            <option value="60">60 seconds</option>
            <option value="Unlimited">Unlimited</option>
          </select>
        </label>
        <Switch labelSwitch="Is this room private?"
          labelInput = "What is the password for the room?"
          placeholder="Password"
          onSwitchChange={(checked) => setIsPrivate(checked)}
          onInputChange={(passwordValue) => setPasswordValue(passwordValue)}
        />
          <div className='buttonGroup-create'>
            <ButtonSimple onClick={() => changePage("home")} text="Cancel" variant="grey_purple" size="w400h90" />
            <ButtonSimple text="Create room" variant="grey_purple" size="w400h90"/>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreationRoom;

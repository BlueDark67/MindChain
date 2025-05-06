import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../../src/components/switch/switch";
import ButtonSimple from "../../src/components/buttonSimple/buttonSimple";
import { handleErros, validateRoomForm, getRandomTheme } from "../../public/js/CreationRoom.js";
import './CreationRoom.css';
import '../Global.css';
import Sidebar from '../../src/components/Menu/Menu.jsx';



function CreationRoom() {
  const [themeValue, setThemeValue] = useState("");
  const [isThemeChosen, setIsThemeChosen] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [sessionTime, setSessionTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
          document.title = "Create Room";
          document.body.classList.add('gradient_background_BP','allow_scroll');
  
          return () => {
            document.body.classList.remove('gradient_background_BP','allow_scroll');
          }
  }, []);

  const navigate = useNavigate();

  const changePage = ( page) => {
    navigate("/" + page);
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const validation = validateRoomForm({isThemeChosen, themeValue, isPrivate, passwordValue, sessionTime} );
    if (!validation.valid) {
      setErrorMessage(validation.message);
      return;
    }

    let finalTheme;
    if(isThemeChosen){
      finalTheme = themeValue;
    }else{
      finalTheme = await getRandomTheme();
    }

    let sessionTimeValue;
    if (sessionTime === "Unlimited") {
      sessionTimeValue = -1; // ou sessionTimeValue = -1;
    } else {
      sessionTimeValue = Number(sessionTime);
    }

    const requestBody ={
      theme: finalTheme,
      password: isPrivate ? passwordValue : null,
      time: sessionTimeValue,
      isPrivate: isPrivate,
    }

    try {
      const res = await fetch("http://localhost:3000/create-room",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(requestBody),
      });
      handleErros(res);
      const json = await res.json();
      var page = json.view+"/"+json.roomId; 
      changePage(page);
    } catch (err) {
      console.error(err);
    }
  }
       
  return (
    <div>
      <Sidebar/>
      <h1 className="h1-create">Creation Room</h1>
      <form className="creation-room-form-inputs" method="POST" onSubmit={handleSubmit}>
        <div className="creation-room-form">
        <Switch labelSwitch="Is the theme choosen by the creator?"
          labelInput="What is the theme?"
          placeholder="Theme"
          onSwitchChange={(checked) => setIsThemeChosen(checked)}
          onInputChange={(themeValue) => setThemeValue(themeValue)}
        />
        <label className="label-create">
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
        {errorMessage && <p className="error-message-create">{errorMessage}</p>}
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

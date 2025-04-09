import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './NotFound.css';
import '../Global.css';
import ButtonSimple from "../../src/components/buttonSimple/buttonSimple";

function NotFound(){
    useEffect(() => {
            document.title = "Not Found";
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, []);

    const navigate = useNavigate();

    const changePage = ( page) => {
        navigate(`/${page}`);
    }    

    return(
        <div className="center">
            <h1>Oops!</h1>
            <h2>404 ○ PAGE NOT FOUND</h2>
            <div className="centerObjects">
                <p>The page you are looking for doesn't exist, might have been removed, had it's name changed or is temporarily unavailable</p>
                <ButtonSimple text="Go to HomePage" onClick = {() => changePage("home")} variant="darkmagenta" size ="w250h50"/>
            </div>
            
        </div>
    );
}

export default NotFound;
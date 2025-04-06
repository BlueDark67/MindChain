import { useEffect } from "react";
import './SignUp.css';
import'../Global.css';


function SignUp(){
    useEffect(() => {
        document.title = "SignUp Page"

        document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
    },[]);
}

export default SignUp;
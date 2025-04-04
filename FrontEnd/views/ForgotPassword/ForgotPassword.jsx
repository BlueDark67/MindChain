import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from "react";
import MindChain from '../../public/MindChain.png';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import './ForgotPassword.css';
import '../Global.css';

function ForgotPassword() {
    useEffect(() => {
        document.title = "Forgot Password";
        document.body.classList.add('gradient_background_BPB');

        return () => {
            document.body.classList.remove('gradient_background_BPB');
        }
    }, []);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email: ", { email });
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validateEmail = () => {
        
        if (email.trim() === "") {
            setEmailError("");
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailError("Insert a valid email address");
        } else {
            setEmailError("");
        }
    };

    const navigate = useNavigate();

    const changePage = ( page) => {
        navigate(`/${page}`);
    }
                     
    return (
        <>
            <div className='center'>
                <div className='container'>
                    <img src={MindChain} alt="Logo" className='logo' />
                    <h1>Forgot your password?</h1>
                    <span>Enter your email address and we'll send you a link to set your password.</span>
                    <form className='forgotPasswordForm' onSubmit={handleSubmit}>
                        <h2>Email</h2>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className={`emailInput ${emailError ? "error" : ""}`} 
                            onChange={(e) => setEmail(e.target.value)} 
                            onFocus={() => setEmailError("")}     
                            onBlur={validateEmail}                
                        />
                        { emailError && <p className="emailError">{emailError}</p> }
                        <div className='buttonGroup'>
                            <ButtonSimple onClick={() => changePage("login")} text="Cancel" variant="grey" size="w100h25" />
                            <ButtonSimple onClick={() => changePage("")} text="Reset" variant="purple" size="w100h25"/>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;




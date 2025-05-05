import { useEffect, useState } from "react";
import './SignUp.css';
import'../Global.css';
import MindChain from "../../public/MindChain.png"
import ButtonSubmit from "../../src/components/buttonSubmit/buttonSubmit.jsx";
import { useNavigate } from 'react-router-dom';
import { handleErros, isPasswordCriterionMet, validateForm,isEmail } from "../../public/js/SignUp.js";
function SignUp(){
    {/*Constantes para o registo*/}
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
    const [page, setPage] = useState("");
    const navigate = useNavigate();


    {/*Para aplicar o background*/}
    useEffect(() => {
        document.title = "SignUp Page"

        document.body.classList.add('gradient_background_BPB');

        if(page){
            navigate(`/${page}`);
        }

        
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
    },[page, navigate]);

    
    const changePage = ( page) => {
        setPage(page);
    }
    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        //Para validar o formulario
        const error = validateForm(username, email,password, confirmPassword);
        if (error) {
            setErrorMessage(error);
            setIsSubmitting(false);
            return;
        }
        
        const requestBody = {username, email, password};
    

        try {
            const res = await fetch("http://localhost:3000/signup",{
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
            console.error("Register error:",err);
            setErrorMessage("Something went wrong. Please try again later.");
        } finally { 
            setIsSubmitting(false);
        }

    }
    return(
        <div className="center">
            <div className="container">
                <img className="logo" src={MindChain} alt="MindChain logo" />
                <h1 className="title">Create an Account</h1>
                <form className="register-form" onSubmit={handleSubmit} method="POST" autoComplete="off">
                    {/*Parte do username*/}
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                    type="text"
                    className="form-input-register"
                    id="register-username"
                    placeholder="Enter a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    />
                    {/*Parte do email*/}
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                    type="text"
                    className="form-input-register"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                    />
                    {/*Parte do email*/}
                    <div className="password-label-container">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="info-icon"
                            //escolher qual 
                            
                             onClick={() => setShowPasswordCriteria(!showPasswordCriteria)}
                         >
                            ⓘ
                            {showPasswordCriteria && (
                                <div className="password-criteria-tooltip">
                                    <h4>Password must have:</h4>
                                    <ul>
                                            <li className={isPasswordCriterionMet('length', password) ? "met" : ""}>
                                                At least 6 characters
                                            </li>
                                            <li className={isPasswordCriterionMet('uppercase', password) ? "met" : ""}>
                                                At least one uppercase letter
                                            </li>
                                            <li className={isPasswordCriterionMet('lowercase', password) ? "met" : ""}>
                                                At least one lowercase letter
                                            </li>
                                            <li className={isPasswordCriterionMet('number', password) ? "met" : ""}>
                                                At least one number
                                            </li>
                                            <li className={isPasswordCriterionMet('symbol', password) ? "met" : ""}>
                                                At least one symbol
                                            </li>
                                        </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                    type="password"
                    id="password"
                    name="register-password"
                    className="form-input-register"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    />

                    {/*Parte de confirmar a pass*/}
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                    type="password"
                    id="confirmPassword"
                    name="register-confirm-password"
                    className="form-input-register"
                    placeholder="Confirm the password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"

                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                        <ButtonSubmit 
                            type="submit"
                            text={isSubmitting ? "Creating Account..." : "Create Account"} 
                            variant="primary" 
                            size="w100p" 
                            disabled={isSubmitting}
                        />
                        
                </form>

                <div className="additional-links">
                    <p className="signup-text">Already have an account? <a href="/login">Sign in</a></p>
                </div>
            </div>
        </div>

    );
}

export default SignUp;
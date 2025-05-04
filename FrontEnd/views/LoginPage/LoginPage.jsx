import { useEffect } from 'react';
import './LoginPage.css';
import '../Global.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import MindChain from '../../public/MindChain.png';
import { handleErros, validateForm} from '../../public/js/LoginPage.js'


function LoginPage({setIsAuthenticated, isAuthenticated}) {
    const [loginIdentifier, setLoginIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [page, setPage] = useState("");
    const navigate = useNavigate();



    useEffect(() => {
            document.title = "Login Page";
            document.body.classList.add('gradient_background_BPB');

            if(isAuthenticated){
                navigate("/home");
            }

            if(page){
                navigate(`/${page}`);
            }

            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, [page, isAuthenticated,navigate]);

        
    const changePage = ( page) => {
        setPage(page);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        //Para validar o formulario
        const error = validateForm(loginIdentifier, password);
        if (error) {
            setErrorMessage(error);
            setLoading(false);
            return;
        }
        /*
        const loginType = isEmail(loginIdentifier) ? 'email' : 'username';
            
        const requestBody = {[loginType]: loginIdentifier, password: password};
        */
        const requestBody = { username: loginIdentifier, password: password };


        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify(requestBody),
            });
            handleErros(res);
            const json = await res.json();
            console.log("Login response:", json); // depois eliminar
            setIsAuthenticated(json.isAuthenticated);
            if(!json.isAuthenticated){
                setErrorMessage("Invalid credentials"); 
            }  
            localStorage.setItem("userId", json.userId); 
            changePage(json.view);
        } catch (err) {
            console.error("Login error:",err);
            setErrorMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }

          
    };
    
    
    
    return (
        <div className="center">
            {/*Container*/}
            <div className="container">
                {/*Parte da Logo e titulo de Login*/}
                <img className="logo" src={MindChain} alt="MindChain Logo" />
                <h1 className="title">Login</h1>
                {/*Parte do email/password e remeber */}
                <form className="login-form" method='POST' onSubmit={handleSubmit} >
                    <label htmlFor="loginIdentifier" className="form-label">Username or Email</label>
                    {/*parte do input do loginIdentifier*/}
                    <input type="text" 
                    id="loginIdentifier" 
                    className="form-input-login" 
                    placeholder="Enter your username or email" 
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    autoComplete='username'
                    />


                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" 
                    id="password" 
                    className="form-input-login" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete='current-password'
                    />

                    <div className="form-remember">
                        <input type="checkbox" 
                        id="remember-me" 
                        className="custom-checkbox"
                        checked ={rememberMe}
                        onChange={(e) => setRememberMe (e.target.checked)} />
                        <label htmlFor="remember-me">Remember Me</label>
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Press to Login"}
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}



                    
                </form>

                <div className="additional-links">
                    <p className="signup-text">
                        Dont have an account? <a href="/signup" className="signup-link"> Sign up for free</a>
                    </p>
                    <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
                </div>
            </div>
        </div>
      
    );
}

export default LoginPage;
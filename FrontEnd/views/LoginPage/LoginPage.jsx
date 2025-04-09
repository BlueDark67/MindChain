import { useEffect } from 'react';
import './LoginPage.css';
import '../Global.css';
import { useState } from "react";
import MindChain from '../../public/MindChain.png';


function LoginPage() {
    useEffect(() => {
            document.title = "Login Page";
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, []);

    const [loginIdentifier, setLoginIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // Função para identificar se é email ou username
    const isEmail = (value) => {
        // Esta expressão verifica se há caracteres antes e depois do @, e pelo menos um ponto após o @
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    // Função para verificar se o input parece ser uma tentativa de email (contém @)
    const containsAtSymbol = (value) => {
        return value.includes('@');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        if (!loginIdentifier && !password) {
            setErrorMessage("Please fill all the fields");
            return;
        }
        if(!loginIdentifier){
            setErrorMessage("Username or Email is required");
            return;
        }
        if(!password){
            setErrorMessage("Password is required");
            return;
        }

        // Se o input contém @ mas não é um email válido
        if (containsAtSymbol(loginIdentifier) && !isEmail(loginIdentifier)) {
            setErrorMessage("Please enter a valid email format");
            return;
        }


        setLoading(true);
        try {
            // Define o tipo de login que está sendo usado
            const loginType = isEmail(loginIdentifier) ? 'email' : 'username';
            
            const requestBody = {
                [loginType]: loginIdentifier,
                password: password
            };
            
            console.log("Logging in with:", loginType, "Sending login data:", requestBody);
            
            {/*
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestBody }),
            });
            */}
            /*const data = await response.json();
    
            if (response.ok) {
                console.log('Login bem-sucedido:', data);
                // Salvar token e redirecionar
            } else {
                setErrorMessage("Invalid username or password");
            }*/
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Something went wrong. Try again later");
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
                <form className="login-form"  onSubmit={handleSubmit}>
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
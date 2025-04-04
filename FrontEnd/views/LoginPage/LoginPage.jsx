import { useEffect } from 'react';
import './LoginPage.css';
import '../Global.css';
import { useState } from "react";
import MindChain from '../../public/MindChain.png'


function LoginPage() {
    useEffect(() => {
            document.title = "Login Page";
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        if (!username && !password) {
            setErrorMessage("Please fill all the fields");
            return;
        }
        if(!username){
            setErrorMessage("Username or Email is required");
            return;
        }

        if(!password){
            setErrorMessage("Password is required");
            return;
        }

        setLoading(true);
        try {
            {/*
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            */}
            const data = await response.json();
    
            if (response.ok) {
                console.log('Login bem-sucedido:', data);
                // Salvar token e redirecionar
            } else {
                setErrorMessage("Invalid username or password");
            }
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
                    <label htmlFor="username" className="form-label">Username or Email</label>
                    {/*parte do input do username*/}
                    <input type="text" 
                    id="username" 
                    className="form-input" 
                    placeholder="Enter your username or email" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete='username'
                    />


                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" 
                    id="password" 
                    className="form-input" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete='current-password'
                    />

                    <div className="form-remember">
                        <input type="checkbox" id="remember-me" className="custom-checkbox" />
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
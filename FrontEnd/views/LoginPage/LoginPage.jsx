import { useEffect } from 'react';
import './LoginPage.css';
import '../Global.css';
import { useState } from "react";


function LoginPage() {
    useEffect(() => {
            document.title = "Login Page";
            document.title.
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, []);

  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }
        console.log("Logging in with:", { username, password });
    };
    return (

        <div className="login-page">
          <link rel="icon"  href="/images/MindChain.png" type="image/x-icon"></link>
            <div className="container">
                <img className="logo" src="../../public/MindChain.png" alt="MindChain Logo" />
                <h1 className="title">Login</h1>
                <form className="login-form"  onSubmit={handleSubmit}>
                    <label htmlFor="username" className="form-label">Username or Email</label>
                    <input type="text" id="username" className="form-input" 
                    placeholder="Enter your username or email" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password" className="form-input" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="form-remember">
                        <input type="checkbox" id="remember-me" className="custom-checkbox" />
                        <label htmlFor="remember-me">Remember Me</label>
                    </div>

                    <button type="submit" className="login-button">Press to Login</button>
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
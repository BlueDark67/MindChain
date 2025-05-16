import { useEffect } from 'react';
import './LoginPage.css';
import '../Global.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import MindChain from '../../public/MindChain.png';
import { validateForm, loginUser, saveRememberMeData, loadRememberMeData,detectBrowserAutofill} from '../../public/js/LoginPage.js';
import PasswordToggle from '../../src/components/passwordToggle/passwordToggle.jsx';
import ButtonSubmit from '../../src/components/buttonSubmit/buttonSubmit.jsx';

function LoginPage({setIsAuthenticated, isAuthenticated}) {
    const [loginIdentifier, setLoginIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
    const [page, setPage] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

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
    }, [page, isAuthenticated, navigate]);
        
    const changePage = (page) => {
        setPage(page);
    }

    // Carrega dados salvos do "Remember Me"
    useEffect(() => {
        const userData = loadRememberMeData();
        if (userData && userData.loginIdentifier) {
            setLoginIdentifier(userData.loginIdentifier);
        }
    }, []);

    // Detecta autopreenchimento do navegador
    useEffect(() => {
        const checkAutofill = async () => {
            const hasAutofill = await detectBrowserAutofill(
                (inputValue) => inputValue !== loginIdentifier
            );
            
            if (hasAutofill) {
                setHasSavedCredentials(true);
                
                // Atualiza o estado se o input foi preenchido automaticamente
                const usernameInput = document.getElementById('loginIdentifier');
                if (usernameInput && usernameInput.value && usernameInput.value !== loginIdentifier) {
                    setLoginIdentifier(usernameInput.value);
                }
            }
        };
        
        checkAutofill();
    }, []);

    useEffect(() => {
        // Redireciona para home se já estiver autenticado nesta sessão
        if (isAuthenticated && sessionStorage.getItem('authenticated') === 'true') {
            navigate('/home', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        // Validação do formulário
        const error = validateForm(loginIdentifier, password);
        if (error) {
            setErrorMessage(error);
            setLoading(false);
            return;
        }

        try {
            // Usa a função do serviço para fazer login
            const json = await loginUser(loginIdentifier, password, rememberMe);
            setIsAuthenticated(json.isAuthenticated);

            // Gerencia dados de "Remember Me"
            saveRememberMeData(json.isAuthenticated, rememberMe, loginIdentifier);

            if(!json.isAuthenticated){
                setErrorMessage("Invalid credentials"); 
            }  
            localStorage.setItem("userId", json.userId); 
            changePage(json.view);
        } catch (err) {
            console.error("Login error:", err);
            setErrorMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return (
        <div className="center-register">
            {/*Container*/}
            <div className="container">
                {/*Parte da Logo e titulo de Login*/}
                <img className="logo" src={MindChain} alt="MindChain Logo" />
                <h1 className="title">Login</h1>
                {/*Parte do email/password e remeber */}
                <form id="login-form" className="login-form" method='POST' onSubmit={handleSubmit} autoComplete='on' >
                    <label htmlFor="loginIdentifier" className="form-label">Username or Email</label>
                    {/*parte do input do loginIdentifier*/}
                    <input type="text" 
                    id="loginIdentifier" 
                    name="username"
                    className="form-input-login" 
                    placeholder="Enter your username or email" 
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    autoComplete='username'
                    />

                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-field-signup">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password"
                            className="form-input-login" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete='current-password'
                        />
                        <PasswordToggle
                            showPassword={showPassword}
                            toggleVisibility={togglePasswordVisibility}
                            />
                    </div>

                    <div className="form-remember">
                        <input type="checkbox" 
                        id="remember-me" 
                        name="remember-me" 
                        className="custom-checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)} />
                        <label htmlFor="remember-me">Remember Me</label>
                    </div>
                    
                    <ButtonSubmit 
                        type="submit"
                        text={loading ? "Logging in..." : "Log In"} 
                        variant="primary" 
                        size="w100p" 
                        disabled={loading}
                    />
                    
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
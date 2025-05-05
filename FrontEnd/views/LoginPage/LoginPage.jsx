import { useEffect } from 'react';
import './LoginPage.css';
import '../Global.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import MindChain from '../../public/MindChain.png';
import { handleErros, validateForm, isEmail } from '../../public/js/LoginPage.js';
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

        
    const changePage = ( page) => {
        setPage(page);
    }

        // Adicione logo após a declaração dos estados e navigate
    useEffect(() => {
        // Verifica se há dados salvos no localStorage
        const savedUser = localStorage.getItem('login_rememberedUser');
        if (savedUser) {
            try {
                // Tenta fazer o parse dos dados salvos
                const userData = JSON.parse(savedUser);
                setLoginIdentifier(userData.loginIdentifier || "");
                // Não carregamos a senha por questões de segurança
            } catch (error) {
                console.error("Erro ao carregar dados salvos:", error);
                localStorage.removeItem('login_rememberedUser');
            }
        }
    }, []);

    // useEffect para detectar preenchimento automático - executado apenas UMA VEZ
    useEffect(() => {
        // Primeiro ativa o foco/desfoco para "provocar" o preenchimento
        const usernameInput = document.getElementById('loginIdentifier');
        const passwordInput = document.getElementById('password');
        
        // Pequeno atraso antes de iniciar a sequência
        const initialDelay = setTimeout(() => {
        // Sequência de foco e desfoco
        if (usernameInput) usernameInput.focus();
        setTimeout(() => {
            if (usernameInput) usernameInput.blur();
            if (passwordInput) passwordInput.focus();
            setTimeout(() => {
            if (passwordInput) passwordInput.blur();
            }, 10);
        }, 10);
        
        // Depois de dar tempo para o navegador preencher, verifica o resultado
        const detectionTimeout = setTimeout(() => {
            // Várias maneiras de detectar preenchimento automático
            const hasAutofill = 
            document.querySelector('input:-webkit-autofill') || 
            (usernameInput && usernameInput.value && loginIdentifier === "") ||
            (passwordInput && passwordInput.value && password === "");
            
            if (hasAutofill) {
            setHasSavedCredentials(true);
            
            // Sincroniza apenas o nome de usuário se estiver preenchido automaticamente
            if (usernameInput && usernameInput.value && loginIdentifier === "") {
                setLoginIdentifier(usernameInput.value);
            }
            }
        }, 500);
        
        return () => clearTimeout(detectionTimeout);
        }, 100); // Atraso antes de iniciar a sequência
        
        return () => clearTimeout(initialDelay);
    }, []); // Array vazio = executa apenas uma vez quando o componente monta

    useEffect(() => {
        // If user is authenticated and has previously logged in this session,
        // redirect back to home
        if (isAuthenticated && sessionStorage.getItem('authenticated') === 'true') {
            navigate('/home', { replace: true });
        }
    }, [isAuthenticated]);

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
        const requestBody = { 
            username: loginIdentifier, 
            password: password, 
            rememberMe: rememberMe // Passa o estado do checkbox para o servidor
        };


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

                // Salva ou remove os dados com base no checkbox "lembrar-me"
            if (json.isAuthenticated) {
                if (rememberMe) {
                    // Salva apenas o identificador de login, NUNCA a senha
                    localStorage.setItem('login_rememberedUser', JSON.stringify({
                        loginIdentifier: loginIdentifier
                    }));
                } else {
                    // Remove os dados caso "lembrar-me" não esteja marcado
                    localStorage.removeItem('login_rememberedUser');
                }
                // Set this after successful login
                sessionStorage.setItem('authenticated', 'true');
            }


            if(!json.isAuthenticated){
                setErrorMessage("Invalid credentials"); 
            }   
            changePage(json.view);
        } catch (err) {
            console.error("Login error:",err);
            setErrorMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }

          
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    
    
    return (
        <div className="center">
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
                    name="username" // Adicione o atributo name (importante!)
                    className="form-input-login" 
                    placeholder="Enter your username or email" 
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    autoComplete='username'
                    />


                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-field">
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
                        checked ={rememberMe}
                        onChange={(e) => setRememberMe (e.target.checked)} />
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
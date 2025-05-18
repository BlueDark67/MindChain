import { useEffect, useState } from "react";
import './SignUp.css';
import'../Global.css';
import MindChain from "../../public/MindChain.png"
import ButtonSubmit from "../../src/components/buttonSubmit/buttonSubmit.jsx";
import { useNavigate } from 'react-router-dom';
import { isPasswordCriterionMet, validateForm, signupUser } from "../../public/js/SignUp.js";
import PasswordCriteriaTooltip from "../../src/components/passwordCriteria/passwordCriteria.jsx";
import PasswordToggle from "../../src/components/passwordToggle/passwordToggle.jsx";

function SignUp(){
    // Constantes para o registo
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); //para as mensagens de erro
    const [isSubmitting, setIsSubmitting] = useState(false); //para saber quando inicio o processo de criar conta e tambem para mudar a animação do botão
    const [showPasswordCriteria, setShowPasswordCriteria] = useState(false); //para mostrar os criterios da password
    const [showPassword, setShowPassword] = useState(false); //para mostrar a password
    const [page, setPage] = useState("");
    const navigate = useNavigate();

    // Para aplicar o background
    useEffect(() => {
        document.title = "SignUp Page"
        document.body.classList.add('gradient_background_BPB', "allow_scrool");

        if(page){
            navigate(`/${page}`);
        }

        return () => {
            document.body.classList.remove('gradient_background_BPB', "allows_crool");
        }
    },[page, navigate]);

    const changePage = (page) => {
        setPage(page);
    }
    
    //Para meter a password visível
    const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        // Para validar o formulario
        const error = validateForm(username, email, password, confirmPassword);
        if (error) {
            //se tiver algum erro no input do username, email, password ou confirmPassword 
            //vai dar o erro em especifico escrito na função validateForm
            setErrorMessage(error);
            setIsSubmitting(false);
            return;
        }

        try {
            // Usa a função do serviço para fazer cadastro
            const json = await signupUser(username, email, password);
            changePage(json.view);
        } catch (err) {
            console.error("Register error:", err);
            setErrorMessage("Something went wrong. Please try again later.");
        } finally { 
            setIsSubmitting(false);
        }
    }
    
    return(
        <div className="center-register">
            <div className="container">
                <img className="logo" src={MindChain} alt="MindChain logo" />
                <h1 className="title">Create an Account</h1>
                <form className="register-form" onSubmit={handleSubmit} method="POST" autoComplete="off">
                    {/*Parte do username*/}
                    <label htmlFor="username" className="form-label-register">Username</label>
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
                    <label htmlFor="email" className="form-label-register">Email</label>
                    <input
                    type="text"
                    className="form-input-register"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                    />
                    {/*Parte da senha*/}
                    <div className="password-label-container">
                        <label htmlFor="password" className="form-label-register">Password</label>
                        <div className="info-icon" onClick={() => setShowPasswordCriteria(!showPasswordCriteria)}>
                            ⓘ
                            <PasswordCriteriaTooltip 
                                password={password}
                                isVisible={showPasswordCriteria}
                                isPasswordCriterionMet={isPasswordCriterionMet}
                            />
                        </div>
                    </div>
                    <div className="password-field">
                        <div>
                            <PasswordToggle
                                showPassword={showPassword}
                                toggleVisibility={togglePasswordVisibility}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="register-password"
                                className="form-input-register"
                                placeholder="Choose a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
                    {/*Parte de confirmar a pass*/}
                    <label htmlFor="confirmPassword" className="form-label-register">Confirm Password</label>
                    <input
                    type={showPassword ? "text" : "password"}                   
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
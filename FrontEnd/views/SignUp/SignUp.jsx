import { useEffect, useState } from "react";
import './SignUp.css';
import'../Global.css';
import MindChain from "../../public/MindChain.png"
import ButtonSubmit from "../../src/components/buttonSubmit/buttonSubmit.jsx";
import { useNavigate } from 'react-router-dom';

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
    

    const isEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    
    
    {/*Codigo para validar a palavra passe com todos os seu criterios*/}
    const validatePassword = (password) => {
        let errors = [];

        if (password.length < 6){
            errors.push("At least 6 characters");
        }
        if (!/[A-Z]/.test(password)){
            errors.push("At least one uppercase");
        }
        if (!/[a-z]/.test(password)){
            errors.push("At least one lowercase");
        }
        if (!/[0-9]/.test(password)){
            errors.push("At least one number");
        }
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            errors.push("At least one symbol");
        }
        return errors;
    }

    //Codigo paraver se a se o criterio de palavra passe foi obtido
    const isPasswordCriterionMet = (criterion) => {
        if(!password) return false;

        switch (criterion) {
            case 'length': return password.length >= 6;
            case 'uppercase': return /[A-Z]/.test(password);
            case 'lowercase': return /[a-z]/.test(password);
            case 'number': return /[0-9]/.test(password);
            case 'symbol': return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
            default: return false;
        }
        
    };    

    const validateForm = () => {
        //Para ver se tem campos nao preenchidos
        if (!username) {
            return "Username is required";
            
           
        }
        if (!email) {
            return "Email is required";
            
        }
        if (email && !isEmail(email)) {
            return "Please enter a valid email format";
            
        }
        if (!password) {
            return "Password is required";
            
        }
        if (!confirmPassword) {
            return ("Please confirm your password");
            
        }
        //Para validar se a palavra passe abrangiu todos os criterios
        const passwordErrors = validatePassword(password);
        if(passwordErrors.length > 0) {
            return ("Password does not meet all the requirements");
            
        }
        //Para confirmar se o confirmPassword é igual ao password
        if(password !== confirmPassword) {
            return ("Password does not match");
            
        }

        return null;
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        //Para validar o formulario
        const error = validateForm();
        if (error) {
            setErrorMessage(error);
            setIsSubmitting(false);
            return;
        }
        
        const requestBody = {username, email, password};
    

        const handleErros = (res) => {
            if (!res.ok) {
                setIsSubmitting(false);
                throw Error(res.status + " - " + res.url);
            }
            return res;
          };

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
            console.error(err);
          }

    }
    return(
        <div className="center">
            <div className="container">
                <img className="logo" src={MindChain} alt="MindChain logo" />
                <h1 className="title">Create an Account</h1>
                <form className="register-form" onSubmit={handleSubmit} method="POST">
                    {/*Parte do username*/}
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                    type="text"
                    className="form-input-register"
                    id="username"
                    placeholder="Enter a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                                            <li className={isPasswordCriterionMet('length') ? "met" : ""}>
                                                At least 6 characters
                                            </li>
                                            <li className={isPasswordCriterionMet('uppercase') ? "met" : ""}>
                                                At least one uppercase letter
                                            </li>
                                            <li className={isPasswordCriterionMet('lowercase') ? "met" : ""}>
                                                At least one lowercase letter
                                            </li>
                                            <li className={isPasswordCriterionMet('number') ? "met" : ""}>
                                                At least one number
                                            </li>
                                            <li className={isPasswordCriterionMet('symbol') ? "met" : ""}>
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
                    className="form-input-register"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    {/*Parte de confirmar a pass*/}
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                    type="password"
                    id="confirmPassword"
                    className="form-input-register"
                    placeholder="Confirm the password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                    <div className="buttons-container">
                        <ButtonSubmit 
                            type="submit"
                            text={isSubmitting ? "Creating Account..." : "Create Account"} 
                            variant="primary" 
                            size="w100p" 
                            disabled={isSubmitting}
                        />
                        
                    </div>
                </form>

                <div className="additional-links">
                    <p className="signup-text">Already have an account? <a href="/login">Sign in</a></p>
                </div>
            </div>
        </div>

    );
}

export default SignUp;
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
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        //Para ver se tem campos nao preenchidos
        if (!username) {
            setErrorMessage("Username is required");
            setIsSubmitting(false);
            return;
        }
        if (!email) {
            setErrorMessage("Email is required");
            setIsSubmitting(false);
            return;
        }
        if (email && !isEmail(email)) {
            setErrorMessage("Please enter a valid email format");
            setIsSubmitting(false);
            return;
        }
        if (!password) {
            setErrorMessage("Password is required");
            setIsSubmitting(false);
            return;
        }
        if (!confirmPassword) {
            setErrorMessage("Please confirm your password");
            setIsSubmitting(false);
            return;
        }
        //Para validar se a palavra passe abrangiu todos os criterios
        const passwordErrors = validatePassword(password);
        if(passwordErrors.length > 0) {
            setErrorMessage("Password does not meet all the requirements");
            setIsSubmitting(false);
            return;
        }
        //Para confirmar se o confirmPassword é igual ao password
        if(password !== confirmPassword) {
            setErrorMessage("Password does not match");
            setIsSubmitting(false);
            return;
        }

        //Se tudo estiver valido é mandado para o backend

        const requestBody = {
            username, email, password
        };

        /* ainda nao funciona
        fetch('http://localhost:3001/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            // Tratar resposta de sucesso
            console.log('Signup successful:', data);
            // Redirecionar para login ou outra página
                window.location.href = '/login';
        })
        .catch(error => {
            // Tratar erros
            console.error('Signup error:', error);
            setErrorMessage("Something went wrong. Try again later");
        })
        .finally(() => {
            setIsSubmitting(false);
        });
        */

        const handleErros = (res) => {
            if (!res.ok) {
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

          


        // Apenas para simulação, definimos como false após um delay
        /*setTimeout(() => {
            setIsSubmitting(false);
            window.location.href = '/login';
        }, 1000);*/


        
    }
    return(
        <div className="center">
            <div className="container">
                <img className="logo" src={MindChain} alt="MindChain logo" />
                <h1 className="title">Create an Account</h1>
                <form className="login-form" onSubmit={handleSubmit} method="POST">
                    {/*Parte do username*/}
                    <label htmlFor="username" className="form-label">Username</label>
                    <input 
                    type="text"
                    className="form-input"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    {/*Parte do email*/}
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                    type="text"
                    className="form-input"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    {/*Parte do email*/}
                    <div>
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
                    className="form-input"

                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    {/*Parte de confirmar a pass*/}
                    <label htmlFor="confirmPassword" className="form-label">ConfirmPassword</label>
                    <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"

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
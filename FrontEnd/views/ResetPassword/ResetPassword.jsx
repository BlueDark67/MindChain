import { useNavigate, useParams } from 'react-router-dom';
import { useState } from "react";
import MindChain from '../../public/MindChain.png'
import Reset from '../../public/reset.png'
import { useEffect } from 'react';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple';
import './ResetPassword.css';
import '../Global.css';
import PasswordToggle from '../../src/components/passwordToggle/passwordToggle';
import { validateNewPassword, validatePassword, isPasswordCriterionMet } from '../../public/js/resetPassword';
import PasswordCriteriaTooltip from '../../src/components/passwordCriteria/passwordCriteria';

function ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Changed from passwordError to errorMessage
    const {userId} = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

    

    useEffect(() => {
            document.title = "MindChain - Reset Password";
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
    }, []);

    
    const handleErros = (res) => {
        if (!res.ok) {
            throw Error(res.status + " - " + res.url);
        }
        return res;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors
        
        // Verificar requisitos de senha
        const error = validateNewPassword(newPassword, confirmPassword);
        if (error) {
            setErrorMessage(error);
            return;
        }
        
        // Verificar se as senhas coincidem
        const matchError = validateNewPassword(newPassword, confirmPassword);
        if (matchError) {
            setErrorMessage(matchError);
            return;
        }
        
        // Continua com o reset da senha...

        console.log(userId);
        const requestBody = {userId: userId, newPassword: newPassword};
        
        try {
            const res = await fetch("http://localhost:3000/resetPassword",{
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
            console.error("Reset password error:", err);
            setErrorMessage("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    const navigate = useNavigate();

    const changePage = (page) => {
        navigate("/" + page);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return(
        <div className='center'>
            <div className='container-reset'>
                <img src={MindChain} alt="Logo" className='logo' />
                <img src={Reset} alt="Reset" className='reset' />
                <h1 className='Text-reset'>Reset your password</h1>
                <form className='resetPasswordForm' onSubmit={handleSubmit}>
                    <label htmlFor="newPassword">New Password</label>
                    <div className="info-icon" onClick={() => setShowPasswordCriteria(!showPasswordCriteria)}>
                            ⓘ
                            <PasswordCriteriaTooltip 
                                password={newPassword}
                                isVisible={showPasswordCriteria}
                                isPasswordCriterionMet={isPasswordCriterionMet}
                            />
                    </div>
                    
                    <div className='password-field-reset'>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your new password" 
                            className='newPasswordInput' 
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <PasswordToggle
                            showPassword={showPassword}
                            toggleVisibility={togglePasswordVisibility}
                            />
                    </div>
                    
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Confirm your new password" 
                            className='confirmPasswordInput' 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                    {/* Changed from span to div with error-message class */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                    <div className='middle'>
                    <ButtonSimple text = "Save" variant = "purple" size = "w200h20" className ="middle" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
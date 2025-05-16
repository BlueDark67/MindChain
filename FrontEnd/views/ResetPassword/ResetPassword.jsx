import { useNavigate, useParams } from 'react-router-dom';
import { useState } from "react";
import MindChain from '../../public/MindChain.png'
import Reset from '../../public/reset.png'
import { useEffect } from 'react';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple';
import './ResetPassword.css';
import '../Global.css';
import PasswordToggle from '../../src/components/passwordToggle/passwordToggle';
import { validateNewPassword, validatePassword } from '../../public/js/resetPassword';

function ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const {userId} = useParams();
    const [showPassword, setShowPassword] = useState(false);

    

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
        
        // Verificar requisitos de senha
        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            setPasswordError(`Password requirements: ${passwordErrors.join(", ")}`);
            return;
        }
        
        // Verificar se as senhas coincidem
        const matchError = validateNewPassword(newPassword, confirmPassword);
        if (matchError) {
            setPasswordError(matchError);
            return;
        }
        
        // Continua com o reset da senha...

        console.log(userId);
        const requestBody = {userId: userId,newPassword: newPassword};
        
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
            console.error(err);
          }
    };

    const navigate = useNavigate();

    const changePage = ( page) => {
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

                    {passwordError && <span className='error'>{passwordError}</span>}
                    <div className='middle'>
                    <ButtonSimple text = "Save" variant = "purple" size = "w200h20" className ="middle" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
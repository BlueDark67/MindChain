import { useNavigate, useParams } from 'react-router-dom';
import { useState } from "react";
import MindChain from '../../public/MindChain.png'
import Reset from '../../public/reset.png'
import { useEffect } from 'react';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple';
import './ResetPassword.css';
import '../Global.css';

function ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const {userId} = useParams();
    

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

        if(newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }    
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

    return(
        <div className='center'>
            <div className='container'>
                <img src={MindChain} alt="Logo" className='logo' />
                <img src={Reset} alt="Reset" className='reset' />
                <h1>Reset your password</h1>
                <span>What would you like to set as your new password??</span>
                <form className='resetPasswordForm' onSubmit={handleSubmit}>
                    <span>New Password</span>
                    <br />
                    <input type="password" placeholder="Enter your new password" className='newPasswordInput' onChange={(e) => setNewPassword(e.target.value)}/>
                    <br />
                    <br />
                    <span>Confirm Password</span>
                    <br />
                    <input type="password" placeholder="Confirm your new password" className='confirmPasswordInput' onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <br />
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
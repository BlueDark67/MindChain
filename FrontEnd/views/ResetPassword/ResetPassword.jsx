import MindChain from '../../public/MindChain.png'
import Reset from '../../public/reset.png'
import { useEffect } from 'react';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple';
import './ResetPassword.css';
import '../Global.css';

function ResetPassword(){
    useEffect(() => {
            document.title = "MindChain - Reset Password";
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, []);

    return(
        <div className='center'>
            <div className='container'>
                <img src={MindChain} alt="Logo" className='logo' />
                <img src={Reset} alt="Reset" className='reset' />
                <h1>Reset your password</h1>
                <span>What would you like to set as your new password??</span>
                <form className='resetPasswordForm'>
                    <span>New Password</span>
                    <br />
                    <input type="password" placeholder="Enter your new password" className='newPasswordInput' />
                    <br />
                    <br />
                    <span>Confirm Password</span>
                    <br />
                    <input type="password" placeholder="Confirm your new password" className='confirmPasswordInput' />
                    <br />
                    <div className='middle'>
                    <ButtonSimple text = "Save" variant = "purple" size = "w200h20" className ="middle" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
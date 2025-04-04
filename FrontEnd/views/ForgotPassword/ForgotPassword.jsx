
import { useEffect } from 'react';
import MindChain from '../../public/MindChain.png';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import './ForgotPassword.css';
import '../Global.css';

function ForgotPassword() {
    useEffect(() => {
        document.title = "Forgot Password";
        document.body.classList.add('gradient_background_BPB');

        return () => {
            document.body.classList.remove('gradient_background_BPB');
        }
    }, []);

    return (
        <>
            <div className='center'>
                <div className='container'>
                    <img src={MindChain} alt="Logo" className='logo' />
                    <h1>Forgot your password?</h1>
                    <span>Enter your email address and we'll send you a link to set your password.</span>
                    <h2>Email</h2>
                    <input type="email" placeholder='Enter your email' className='emailInput' />
                    <div className='buttonGroup'>
                        <ButtonSimple text="Cancel" variant="grey" size="w209h46" />
                        <ButtonSimple text="Reset" variant="purple" size="w209h46"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;


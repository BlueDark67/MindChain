import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();
    
    const changePage = ( page) => {
        navigate(`/${page}`);
    }

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
                        <ButtonSimple onClick= {()=>changePage("login")} text="Cancel" variant="grey" size="w100h25" />
                        <ButtonSimple onClick= {()=>changePage("login")} text="Reset" variant="purple" size="w100h25"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;


import MindChain from '../../public/MindChain.png';
import Email from '../../public/Email.png';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import { useEffect } from 'react';
import './EmailSent.css';
import '../Global.css';

function EmailSent(){
    useEffect(() => {
            document.title = "Email Sent";
            document.body.classList.add('gradient_background_BPB');
    
            return () => {
                document.body.classList.remove('gradient_background_BPB');
            }
        }, []);

    return (
        <div className='center'>
            <div className='container'>
                <img src={MindChain} alt="Logo" className='logo-invite' />
                <img src={Email} alt="Email" className='email' />
                <h1>Check your email!</h1>
                <span>We just emailed you with instructions to reset your password!</span>
                <hr />
                <span className='smallerSize'>For any questions or problems please contact us at</span>
                <br />
                <br />
                <a href="mailto:help@mindchain.com">helpmindchain@gmail.com</a>
            </div>
        </div>
    );
}

export default EmailSent;
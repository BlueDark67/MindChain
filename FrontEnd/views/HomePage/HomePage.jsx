import { useEffect } from 'react';
import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import './HomePage.css';
import '../Global.css';

function InicialPage() {
    useEffect(() => {
        document.title = "HomePage";
        document.body.classList.add('gradient_background_PB');

        return () => {
            document.body.classList.remove('gradient_background_PB');
        }

    }, []);



    return(
        <>
            <h1>Create a new chatroom</h1>
            <div className='buttonGroupTop'>
                <ButtonSimple  text="Let's unlock ideias connecting your minds" variant="grey_purple" size="w830h90" />
                <ButtonSimple  text="Use chatroom code" variant="grey_purple" size="w830h90"/>
            </div>
            <h1>Old Chatrooms</h1>
        </>
    );
}

export default InicialPage;
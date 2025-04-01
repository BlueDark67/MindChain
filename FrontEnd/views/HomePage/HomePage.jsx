import ButtonSimple from '../../src/components/buttonSimple/buttonSimple.jsx';
import './HomePage.css';

function InicialPage() {
    return(
        <div className='container'>
            <title>HomePage</title>
            <h1>Create a new chatroom</h1>
            <div className='buttonGroup'>
                <ButtonSimple  text="Let's unlock ideias connecting your minds" />
                <ButtonSimple  text="Use chatroom code" />
            </div>
            <h1>Old Chatrooms</h1>
        </div>
    );
}

export default InicialPage;
import './Premium.css';
import '../../Global.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../src/components/backButton/backButton';

function Premium() {
    useEffect(() => {
        document.title = "Premium";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    const navigate = useNavigate();

        const changePage = (page) => {
            navigate(`/${page}`);
        }
    return (
        <>
        <div className="chat-room-back-button"><BackButton /></div>
            <div className="container-wrapperpremium">
                <div className="containerstandard">
                    <h1 className="titlestandard">Standard</h1>
                    <p className="textstandard">-Limit of 5 chat rooms per day</p>
                    <p className="textstandard">-Limit of 5 people by chat room</p>
                    <p className="textstandard">-You can only see the last 10 chat you have been in</p>
                </div>
                <div className="containerpremium">
                    <h1 className="titlepremium">Premium</h1>
                    <p className="textpremium">-No limit of chat rooms per day</p>
                    <p className="textpremium">-No limit of people by chat room</p>
                    <p className="textpremium">-You can see all the chat you have been in</p>
                    <button className="buttonpremium" onClick={() => changePage("payment")}>Buy 9,99$ month</button>
                </div>

            </div>
        </>
    );
}
export default Premium;
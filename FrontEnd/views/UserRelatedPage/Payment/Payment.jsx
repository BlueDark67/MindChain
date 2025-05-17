import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import '../../Global.css';
import Cartao from '../../../public/cartaocredit.png';
import Paypal from '../../../public/paypall.png';
import {changeSubscriptionPlan} from '../../../public/js/Payment.js';
import BackButton from '../../../src/components/backButton/backButton.jsx';

function Payment() {
    useEffect(() => {
        document.title = "Payment";
        document.body.classList.add('gradient_background_BB');
        return () => document.body.classList.remove('gradient_background_BB');
    }, []);

    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const [nameOnCard, setNameOnCard] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvc, setCvc] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [paypalInput, setPaypalInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if(paymentMethod === "creditCard"){
            if(nameOnCard === ""){
                setErrorMessage("Please fill in the name on the card");
                return;
            }
            if(cardNumber === ""){
                setErrorMessage("Please fill in the card number");
                return;
            }else if(cardNumber.length !== 16){
                setErrorMessage("Card number must be 16 digits");
                return;
            } else if (!/^\d{16}$/.test(cardNumber)) {
                setErrorMessage("Card number must be 16 digits and only numbers");
                return;
            }
            if(cvc === ""){
                setErrorMessage("Please fill in the CVC");
                return;
            }else if(cvc.length !== 3){
                setErrorMessage("CVC must be 3 digits");
                return;
            }
            if(expiryDate === ""){
                setErrorMessage("Please fill in the expiry date");
                return;
            }
            const [expYear, expMonth] = expiryDate.split('-').map(Number);
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1; // getMonth() é 0-based

            if (
                expYear < currentYear ||
                (expYear === currentYear && expMonth < currentMonth)
            ) {
                setErrorMessage("Expiry date cannot be in the past");
                return;
            }
        }else if(paymentMethod === "paypal"){
            if(paypalInput === ""){
                setErrorMessage("Please fill in the email or phone number");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           const phoneRegex = /^9\d{8}$/;

            if (emailRegex.test(paypalInput)) {
                setErrorMessage(""); // válido
                // continua o fluxo normal
            } else if (phoneRegex.test(paypalInput)) {
                setErrorMessage(""); // válido
                // continua o fluxo normal
            } else if (/^\d+$/.test(paypalInput)) {
                setErrorMessage("Phone number must start with 9 and have 9 digits");
                return;
            } else {
                setErrorMessage("Please enter a valid email address");
                return;
            }
        }
        changeSubscriptionPlan(userId).then((data) => {
            if(data){
                if(data.changeConfirmation){
                    navigate(`/userpage/${userId}`);
                }
            }
        });

    };

    return (
        <div className="container-wrapperpayment">
            <BackButton customClass="chat-room-back-button" />
            <div className="payment-box">
                <h3 className="payment-title">Payment methods</h3>
                <div className="payment-method-select">
                    <div
                        className={`method ${paymentMethod === 'creditCard' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod("creditCard")}
                    >
                        <img  className= "cartao-credito"src={Cartao} alt="Credit Card" />
                    </div>
                    <div
                        className={`method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod("paypal")}
                    >
                        <img className="paypal" src={Paypal} alt="PayPal" />
                    </div>
                </div>

                <form className="payment-form" onSubmit={handleSubmit}>
                    {paymentMethod === "creditCard" ? (
                        <>
                            <input type="text" placeholder="NAME ON CARD" value={nameOnCard}  onChange={(e) => setNameOnCard(e.target.value)}/>
                            <input type="text" placeholder="CARD NUMBER" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                            <div className="split-fields">
                                <input type="month" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                                <input type="text" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <>
                            <input type="text" placeholder="Enter your e-mail or your phone number"value={paypalInput} onChange={(e) => setPaypalInput(e.target.value)}/>
                        </>
                    )}

                    <p className="terms-text">
                        Your subscription will continue until you cancel. You can cancel at any time via your bank account or by contacting us. By selecting “SUBMIT”, you agree to the above terms.
                    </p>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="form-buttons">
                        <button className="cancelpay-button" type="button" onClick={() => navigate(-1)}>Cancel</button>
                        <button className="paybuttons" type="submit" onClick={handleSubmit}>Continue</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Payment;

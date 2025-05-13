import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import '../../Global.css';
import Cartao from '../../../public/cartaocredit.png';
import Paypal from '../../../public/paypall.png';

function Payment() {
    useEffect(() => {
        document.title = "Payment";
        document.body.classList.add('gradient_background_BB');
        return () => document.body.classList.remove('gradient_background_BB');
    }, []);

    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("creditCard");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Payment made using ${paymentMethod}`);
    };

    return (
        <div className="container-wrapperpayment">
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
                            <input type="text" placeholder="NAME ON CARD" required />
                            <input type="text" placeholder="CARD NUMBER" required />
                            <div className="split-fields">
                                <input type="month" placeholder="MM/YY" required />
                                <input type="text" placeholder="CVC" required />
                            </div>
                        </>
                    ) : (
                        <>
                            <input type="email" placeholder="Enter your e-mail or your phone number" required />
                        </>
                    )}

                    <p className="terms-text">
                        Your subscription will continue until you cancel. You can cancel at any time via your bank account or by contacting us. By selecting “SUBMIT”, you agree to the above terms.
                    </p>

                    <div className="form-buttons">
                        <button className="cancelpay-button" type="button" onClick={() => navigate(-1)}>Cancel</button>
                        <button className="paybuttons" type="submit" onClick={() => navigate('/home')}>Continue</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Payment;

import './NewPassword.css';
import '../../Global.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../../public/js/NewPassword';

function NewPassword() {
    useEffect(() => {
        document.title = "New Password";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const userId = localStorage.getItem('userId');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === ""){
            setError("New password cannot be empty");
            return;
        }
        if(confirmPassword === ""){
            setError("Confirm password cannot be empty");
            return;
        }
        if (password === confirmPassword) {
            changePassword(userId, password).then((response) => {
                if (response && response.confirmation) {
                    navigate('/home');
                } else {
                    setError('Error changing password');
                }
            });
        } else {
            setError('Passwords do not match');
        }
    };

    const changePage = (page) => navigate(`/${page}`);

    return (
        <div className="container-wrappernewpassword">
            <div className="password-container">
                {/* Contêiner para os campos de senha e botões */}
                <form onSubmit={handleSubmit} className="password-form">
                    <div className="password-fields">
                        <label>
                            New Password
                            <input
                                placeholder="New password"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                
                            />
                        </label>
                        <label>
                            Confirm Password
                            <input
                                placeholder="Confirm new password"
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                
                            />
                        </label>
                        {error && <p className="error-message">{error}</p>}
                        <div className="button-group">
                            <button type="button" className="cancelnewpassword" onClick={() => changePage("userpage")}>Cancel</button>
                            <button type="submit" className="buttonnewpassword">Continue</button>
                        </div>
                
                    </div>
                </form>
                {/* Contêiner para os requisitos da senha */}
                <div className="password-requirements">
                    <p>Password must contain:</p>
                    <ul>
                        <li>At least 6 characters</li>
                        <li>At least 1 uppercase letter</li>
                        <li>At least 1 lowercase letter</li>
                        <li>At least 1 number</li>
                        <li>At least 1 special character</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default NewPassword;

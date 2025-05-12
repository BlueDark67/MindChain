import './NewPassword.css';
import '../../Global.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            console.log('Password changed successfully!');
        } else {
            console.error('Passwords do not match!');
        }
    };

    const changePage = (page) => navigate(`/${page}`);

    return (
        <div className="container-wrappernewpassword">
            <div className="password-container">
                {/* Contêiner para os campos de senha e botões */}
                <div className="password-fields">
                    <label>
                        New Password
                        <input
                            placeholder="@A_12bd4"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </label>
                    <label>
                        Confirm Password
                        <input
                            placeholder="@A_12bd4"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </label>
                    <div className="button-group">
                        <button type="button" className="cancelnewpassword" onClick={() => changePage("userpage")}>Cancel</button>
                        <button type="submit" className="buttonnewpassword">Continue</button>
                    </div>
                </div>
    
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

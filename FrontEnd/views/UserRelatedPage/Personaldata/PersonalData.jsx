import profilePic from '../../../public/avatar.png';
import editIcon from '../../../public/editlogo.png';
import { useState, useEffect } from 'react';
import './PersonalData.css';
import '../../Global.css';

function PersonalData() {
    useEffect(() => {
        document.title = "Personal Data";
        document.body.classList.add('gradient_background_BB');

        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: "Jorginho",
        email: "afonsojorge05@gmail.com",
        birthdate: "2005-08-27",
        nationality: "Portuguese",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    return (
        <div className="container-wrapperPD">
            <div className="containerPD">
                <img className="avatar" src={profilePic} alt="profile picture" />
                <b className="changeavatar">Change Avatar</b>
                <h1 className="edit" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Save" : "Edit"}
                    <img className="editicon" src={editIcon} alt="edit logo" />
                </h1>
                {isEditing ? (
                    <div>
                        <label>
                            <b>Username</b>
                            <p>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </p>
                        </label>
                        <label>
                            <b>E-mail</b>
                            <p>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </p>
                        </label>
                        <label>
                            <b>BirthDate</b>
                            <p>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                />
                            </p>
                        </label>
                        <label>
                            <b>Nationality</b>
                            <p>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleInputChange}
                                />
                            </p>
                        </label>
                    </div>
                ) : (
                    <div>
                        <b>Username</b>
                        <p>{formData.username}</p>
                        <b>E-mail</b>
                        <p>{formData.email}</p>
                        <b>Birthdate</b>
                        <p>{formData.birthdate}</p>
                        <b>Nationality</b>
                        <p>{formData.nationality}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalData;
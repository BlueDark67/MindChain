import profilePic from '../../../public/avatar.png';
import editIcon from '../../../public/editlogo.png';
import { useState, useEffect } from 'react';
import './PersonalData.css';
import '../../Global.css';
import BackButton from '../../../src/components/backButton/backButton';
import { fetchUserInfo, changeUserInfo } from '../../../public/js/PersonalData';

function PersonalData() {
    const userId = localStorage.getItem("userId");

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        birthdate: "",
        nationality: "",
    });
    const [avatar, setAvatar] = useState(profilePic);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        document.title = "Personal Data";
        document.body.classList.add('gradient_background_BB');

        fetchUserInfo(userId).then((data) => {
            if (data) {
                setFormData({
                    username: data.user.username,
                    email: data.user.email,
                    birthdate: data.user.birthdate,
                    nationality: data.user.nationality,
                });
            }
        });
        return () => {
            document.body.classList.remove('gradient_background_BB');
        };
    }, []);

    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        changeUserInfo(userId, formData.username, formData.email, formData.birthdate, formData.nationality);
        setIsEditing(false);
    }
        return (            
            <div className="container-wrapperPD">
                <BackButton customClass="chat-room-back-button" />
            
            <div className="containerPD">
                <img className="avatar" src={avatar} alt="profile picture" />
                {isEditing && (
                <label className="changeavatar">
                    Change Avatar
                    <input
                        type="file"
                        accept="image/*"
                        className="changeavatar"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                        disabled={!isEditing}
                    />
                </label>
                )}
                {!isEditing ? (
                    <button
                        className="edit" 
                        type="button"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                        <img className="editicon" src={editIcon} alt="edit logo" />
                    </button>
                ) : null}
                    {isEditing ? (
                        <form onSubmit={handleSave}>
                            <button type="submit" className="edit">
                                Save
                                <img className="editicon" src={editIcon} alt="edit logo" />
                            </button>
                            <label>
                                <b className="bpersonaldata">Username</b>
                                <input
                                    className="inputuserpage"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                <b className="bpersonaldata">E-mail</b>
                                <input
                                    className="inputuserpage"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                <b className="bpersonaldata">BirthDate</b>
                                <input
                                    className="inputuserpage"
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                <b className="bpersonaldata">Nationality</b>
                                <input
                                    className="inputuserpage"
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </form>
                    ) : (
                        <div>
                            <b className="bpersonaldata">Username</b>
                            <p className="ppersonaldata">{formData.username}</p>
                            <b className="bpersonaldata">E-mail</b>
                            <p className="ppersonaldata">{formData.email}</p>
                            <b className="bpersonaldata">Birthdate</b>
                            <p className="ppersonaldata">{formData.birthdate}</p>
                            <b className="bpersonaldata">Nationality</b>
                            <p className="ppersonaldata">{formData.nationality}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
export default PersonalData;
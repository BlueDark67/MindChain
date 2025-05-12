import profilePic from '../../../public/avatar.png';
import editIcon from '../../../public/editlogo.png';
import { useState, useEffect } from 'react';
import './PersonalData.css';
import '../../Global.css';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

        const changePage = (page) => {
            navigate(`/${page}`);
        }

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
                        <form onSubmit={(e) => e.preventDefault()}>
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
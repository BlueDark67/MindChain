import profilePic from '../../../public/avatar.jpg';

function PersonalData(){
    const username = "Jorginho";
    const email = "afonsojorge05@gmai.com";
    const birthdate = "2005-08-27";
    const nationality= "Portuguese";
    return(
        <div className='container'>
            <img className='avatar' src={profilePic} alt="profile picture" />
            <b>Change Avatar</b>
            <h1>Edit</h1>
            <b>Username</b>
            <p>{username}</p>
            <b>E-mail</b>
            <p>{email}</p>
            <b>birthdate</b>
            <p>{birthdate}</p>
            <b>Nationality</b>
            <p>{nationality}</p>
        </div>
    )
}

export default PersonalData;
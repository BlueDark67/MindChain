import {BrowserRouter, Routes, Route} from "react-router-dom";

import PersonalData from "../views/UserRelatedPage/Personaldata/PersonalData.jsx";
import HomePage from "../views/HomePage/HomePage.jsx";
import ForgotPassword from "../views/ForgotPassword/ForgotPassword.jsx";
import LoginPage from "../views/LoginPage/LoginPage";
import PersonalData from "../views/UserRelatedPage/Personaldata/PersonalData.jsx";
import EmailSent from "../views/EmailSent/EmailSent.jsx";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/personal-data" element={<PersonalData />} />
                <Route path="/email-sent" element={<EmailSent />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
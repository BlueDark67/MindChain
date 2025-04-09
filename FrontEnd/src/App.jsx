import {BrowserRouter, Routes, Route} from "react-router-dom";

import PersonalData from "../views/UserRelatedPage/Personaldata/PersonalData.jsx";
import HomePage from "../views/HomePage/HomePage.jsx";
import ForgotPassword from "../views/ForgotPassword/ForgotPassword.jsx";
import LoginPage from "../views/LoginPage/LoginPage";
import EmailSent from "../views/EmailSent/EmailSent.jsx";
import ResetPassword from "../views/ResetPassword/ResetPassword.jsx";
import SignUp from "../views/SignUp/SignUp.jsx";
import NotFound from "../views/NotFound/NotFound.jsx";
import Teste from "../views/Teste/Teste.jsx";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/personal-data" element={<PersonalData />} />
                <Route path="/email-sent" element={<EmailSent />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/teste" element={<Teste />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
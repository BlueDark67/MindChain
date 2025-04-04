import {BrowserRouter, Routes, Route} from "react-router-dom";


import HomePage from "../views/HomePage/HomePage.jsx";
import ForgotPassword from "../views/ForgotPassword/ForgotPassword.jsx";
import LoginPage from "../views/LoginPage/LoginPage";
import PersonalData from "../views/UserRelatedPage/Personaldata/PersonalData.jsx";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/personal-data" element={<PersonalData />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
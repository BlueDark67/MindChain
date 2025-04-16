import {BrowserRouter, Routes, Route} from "react-router-dom";
import { useState, useEffect } from "react";
import PersonalData from "../views/UserRelatedPage/Personaldata/PersonalData.jsx";
import HomePage from "../views/HomePage/HomePage.jsx";
import ForgotPassword from "../views/ForgotPassword/ForgotPassword.jsx";
import LoginPage from "../views/LoginPage/LoginPage";
import EmailSent from "../views/EmailSent/EmailSent.jsx";
import ResetPassword from "../views/ResetPassword/ResetPassword.jsx";
import SignUp from "../views/SignUp/SignUp.jsx";
import NotFound from "../views/NotFound/NotFound.jsx"; 
import PrivateRoute from "./PrivateRoute.jsx";
import CreationRoom from "../views/CreationRoom/CreationRoom.jsx";
import InvitePage from "../views/InvitePage/InvitePage.jsx";
import UnlockRoom from "../views/UnlockRoom/UnlockRoom.jsx";
import LogOut from "../views/UserRelatedPage/Logout/LogOut.jsx";

function App(){
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
      );
  
      useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
      }, [isAuthenticated]);

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/email-sent" element={<EmailSent />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/personal-data" element={<PersonalData />} />
                    <Route path="/create-room" element={<CreationRoom />} />
                    <Route path="/invite/:roomId" element={<InvitePage />} />
                    <Route path="/unlock-room/:roomId" element={<UnlockRoom />} />
                    <Route path="/logout" element={<LogOut setIsAuthenticated={setIsAuthenticated} />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
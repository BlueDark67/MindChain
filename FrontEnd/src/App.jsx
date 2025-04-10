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
import Teste from "../views/Teste/Teste.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function App(){
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
      );
  
      // Sincroniza o estado com o localStorage sempre que mudar
      useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
      }, [isAuthenticated]);
    console.log("isAuthenticated: ", isAuthenticated);

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
                </Route>
                <Route path="/teste" element={<Teste />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
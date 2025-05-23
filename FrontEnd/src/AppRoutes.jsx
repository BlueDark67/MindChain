import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

//Páginas públicas
import LoginPage from '../views/LoginPage/LoginPage';
import SignUp from '../views/SignUp/SignUp';
import ForgotPassword from '../views/ForgotPassword/ForgotPassword';
import EmailSent from '../views/EmailSent/EmailSent';
import ResetPassword from '../views/ResetPassword/ResetPassword';
import NotFound from '../views/NotFound/NotFound';

//Páginas privadas
import HomePage from '../views/HomePage/HomePage';
import PersonalData from '../views/UserRelatedPage/Personaldata/PersonalData';
import CreationRoom from '../views/CreationRoom/CreationRoom';
import InvitePage from '../views/InvitePage/InvitePage';
import UnlockRoom from '../views/UnlockRoom/UnlockRoom';
import LogOut from '../views/UserRelatedPage/Logout/LogOut';
import Chatroom from '../views/ChatRoom/Chatroom';
import ChatRoomAiText from '../views/ChatRoomAiText/ChatRoomAiText';
import Payment from '../views/UserRelatedPage/Payment/Payment'; 
import Premium from '../views/UserRelatedPage/Premium/Premium';
import NewPassword from '../views/UserRelatedPage/NewPassword/NewPassword';
import Metrics from '../views/UserRelatedPage/MetricsPage/Metrics';
import DeleteAccount from '../views/UserRelatedPage/DeleteAccount/DeleteAccount';
import Userpage from '../views/UserRelatedPage/UserPage/UserPage';
import AboutUs from '../views/UserRelatedPage/AboutUs/AboutUs';
import Progress from '../views/UserRelatedPage/Progress/Progress';

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      
      {/*Rotas públicas */}
      <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/email-sent" element={<EmailSent />} />
      <Route path="/reset-password/:userId" element={<ResetPassword />} />

      
      {/*Rotas privadas */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/personal-data" element={<PersonalData />} />
        <Route path="/create-room" element={<CreationRoom />} />
        <Route path="/invite/:roomId" element={<InvitePage />} />
        <Route path="/unlock-room/:roomId" element={<UnlockRoom />} />
        <Route path="/unlock-room" element={<UnlockRoom />} />
        <Route path="/logout" element={<LogOut setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/chatroom/:roomId" element={<Chatroom />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/delete-account" element={<DeleteAccount setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/userpage/:userId" element={<Userpage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/progress" element={<Progress />} />

        <Route path='/chatroom-aitext/:roomId' element={< ChatRoomAiText/>} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
// /src/pages/AuthorizePage/AuthorizePage.tsx

import { Route, Routes } from "react-router-dom";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import RegisterComponent from "../../components/RegisterComponent/RegisterComponent";
import "./AuthorizePage.css";

function AuthorizePage() {
    return (
        <div className="auth-page">
            <div className="auth-page__background">
                <div className="auth-page__gradient"></div>
            </div>
            
            <div className="auth-page__container">
                <Routes>
                    <Route path="Login" element={<LoginComponent />} />
                    <Route path="register" element={<RegisterComponent />} />
                </Routes>
            </div>
        </div>
    )
}

export default AuthorizePage;
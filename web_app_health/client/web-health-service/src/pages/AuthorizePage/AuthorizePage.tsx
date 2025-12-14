import { Route, Routes } from "react-router-dom";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import RegisterComponent from "../../components/RegisterComponent/ProfileComponent";

function AuthorizePage() {
    return (
        <>
            <HeaderComponent />
            <Routes>
                <Route path="Login" element={<LoginComponent />} />
                <Route path="register" element={<RegisterComponent />} />
            </Routes>

        </>
    )
}

export default AuthorizePage;
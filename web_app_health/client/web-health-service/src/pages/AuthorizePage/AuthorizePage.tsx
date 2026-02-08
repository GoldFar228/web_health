import { Route, Routes } from "react-router-dom";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import RegisterComponent from "../../components/RegisterComponent/RegisterComponent";

function AuthorizePage() {
    return (
        <>
            <Routes>
                <Route path="Login" element={<LoginComponent />} />
                <Route path="register" element={<RegisterComponent />} />
            </Routes>

        </>
    )
}

export default AuthorizePage;
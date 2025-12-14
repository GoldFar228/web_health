import { useNavigate } from "react-router-dom"
import "./HeaderComponent.css"

const HeaderComponent = () => {
    const navigate = useNavigate();
    const handleClick = (str: string) => {
        navigate(str);
    }
    return (
    <>
        <div className="header-container">
            <div className="header-item" onClick={() => handleClick("./")}>Home</div>
            <div className="header-item" onClick={() => handleClick("../Trainings")}>Programs</div>
            <div className="header-item" onClick={() => handleClick("../Diets")}>Diets</div>
            <div className={localStorage.getItem("token") !== null ? "header-item" : "header-item hidden" } onClick={() => handleClick("../Profile")}>Profile</div>
            <div className="header-item" onClick={() => handleClick("../Auth/Login")}>Login</div>
        </div>
    </>
    )
}

export default HeaderComponent;
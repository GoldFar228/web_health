import { useNavigate } from "react-router-dom"
import "./HeaderComponent.css"
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
    const profile = useSelector((state: RootState) => state.auth.profile);
    const userName = profile?.firstName || 'Гость';
    const navigate = useNavigate();
    const handleClick = (str: string, event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.currentTarget as HTMLDivElement;

        if(target.textContent === "Logout"){
            localStorage.removeItem("token");
        }
        navigate(str);
        
    }
    return (
        <>
            <div className="header-container">
                <div className="header-item" onClick={(e) => handleClick("../Home",e)}>Home</div>
                <div className="header-item" onClick={(e) => handleClick("../Trainings", e)}>Programs</div>
                <div className="header-item" onClick={(e) => handleClick("../Diets", e)}>Diets</div>
                <div className={localStorage.getItem("token") !== null ? "header-item" : "header-item hidden"} onClick={(e) => handleClick("../Profile", e)}>Profile({userName})</div>
                <div className="header-item" onClick={(e) => handleClick("../Auth/Login", e)}>{localStorage.getItem("token") !== null ? "Logout" : "Login"}</div>
            </div>
        </>
    )
}

export default HeaderComponent;
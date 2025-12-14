import axios from "axios";
import "./ProfileComponent.css"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
    const [formData, setformData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        midName: "",
    });

    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const navigate = useNavigate();
    const navigateTo = (str: string) => {
        navigate(`${str}`)
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        
    }
    return (
        <>
            <div className="register-form">
                <form onSubmit={handleSubmit}>
                    <div className="register-item">
                        <label>Email</label>
                        <div id="">123</div>
                    </div>
                    <div className="register-item">
                        <label>Пароль</label>
                        <input type="password" name="password" onChange={handleChange} value={formData.password} id="" required />
                    </div>
                    <div className="register-item">
                        <label>Имя</label>
                        <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} id="" required />
                    </div>
                    <div className="register-item">
                        <label>Фамилия</label>
                        <input type="text" name="lastName" onChange={handleChange} value={formData.lastName} id="" required />
                    </div>
                    <div className="register-item">
                        <label>Отчество</label>
                        <input type="text" name="midName" onChange={handleChange} value={formData.midName} id="" />
                    </div>
                    <button type="submit" onSubmit={handleSubmit}>Подтвердить изменения</button>
                </form>
                <div>
                    <span className="login-link">Изменить данные</span>
                </div>
            </div>
        </>
    )
}

export default ProfileComponent;
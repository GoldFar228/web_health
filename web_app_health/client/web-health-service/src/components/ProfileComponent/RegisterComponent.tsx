import axios from "axios";
import "./RegisterComponent.css"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
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

        try {
            const response = await axios.post("https://localhost:7073/api/Auth/Register/register",
                formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Успех: ', response.data);
            navigateTo("../../Home");
            localStorage.setItem("token", response.data.token);
        }
        catch (error) {
            console.log('Провал', error.message)
        }
    }
    return (
        <>
            <div className="register-form">
                <form onSubmit={handleSubmit}>
                    <div className="register-item">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} value={formData.email} id="" required />
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
                    <button type="submit" onSubmit={handleSubmit}>зарегистрироваться</button>
                </form>
                <div>
                    Уже есть аккаунт?
                    <span className="login-link" onClick={() => navigateTo("../Login")}>Войти</span>
                </div>
            </div>
        </>
    )
}

export default RegisterComponent;
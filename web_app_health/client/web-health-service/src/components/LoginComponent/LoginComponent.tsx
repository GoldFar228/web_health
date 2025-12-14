import axios from "axios";
import "./LoginComponent.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
    const [formData, setformData] = useState({
        email: "",
        password: ""
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
            const response = await axios.post("https://localhost:7073/api/Auth/Login/login",
                formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => localStorage.setItem("token", res.data.token));
            // console.log('Успех: ', response.data);
            navigateTo("../../Home");
            // localStorage.setItem("token", response.data.token)

        }
        catch (error) {
            console.log('Провал', error.message)
        }
        
    }
    return (
        <>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="login-item">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} value={formData.email} id="" required />
                    </div>
                    <div className="login-item">
                        <label>Пароль</label>
                        <input type="password" name="password" onChange={handleChange} value={formData.password} id="" required />
                    </div>
                    <button type="submit" onSubmit={handleSubmit}>Войти</button>
                </form>
                <div>
                    Нет аккаунта?
                    <div className="register-link" onClick={() => {navigateTo("../Register")}}>зарегистрироваться</div>
                </div>
            </div>
        </>
    )
}

export default LoginComponent;
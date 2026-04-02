// /src/components/RegisterComponent/RegisterComponent.tsx

import axios from "axios";
import "./RegisterComponent.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
    const [formData, setformData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        midName: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "https://localhost:7073/api/Auth/Register/register",
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            localStorage.setItem("token", response.data.token);
            navigateTo("../../Home");
        }
        catch (error: any) {
            if (error.response.data === "User exists") {
                setError("Пользователь с таким email существует")
            }
            if(error.response.errorMessage === "Неверная почта или пароль"){
                setError("Неверная почта или пароль")
            }
            else {
                setError(error.message || 'Ошибка регистрации');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="register-form">
            <div className="register-form__header">
                <span className="register-form__logo">💪</span>
                <h1 className="register-form__title">Создать аккаунт</h1>
                <p className="register-form__subtitle">Начните свой путь к здоровью</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form__body">
                {error && (
                    <div className="register-form__error">
                        <span className="register-form__error-icon">⚠️</span>
                        <span className="register-form__error-text">{error}</span>
                    </div>
                )}

                <div className="register-form__row">
                    <div className="register-form__field">
                        <label className="register-form__label" htmlFor="reg-firstName">
                            👤 Имя
                        </label>
                        <input
                            id="reg-firstName"
                            type="text"
                            name="firstName"
                            className="register-form__input"
                            onChange={handleChange}
                            value={formData.firstName}
                            placeholder="Иван"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="register-form__field">
                        <label className="register-form__label" htmlFor="reg-lastName">
                            👤 Фамилия
                        </label>
                        <input
                            id="reg-lastName"
                            type="text"
                            name="lastName"
                            className="register-form__input"
                            onChange={handleChange}
                            value={formData.lastName}
                            placeholder="Иванов"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="register-form__field">
                    <label className="register-form__label" htmlFor="reg-midName">
                        👤 Отчество
                    </label>
                    <input
                        id="reg-midName"
                        type="text"
                        name="midName"
                        className="register-form__input"
                        onChange={handleChange}
                        value={formData.midName}
                        placeholder="Иванович"
                        disabled={isLoading}
                    />
                </div>

                <div className="register-form__field">
                    <label className="register-form__label" htmlFor="reg-email">
                        📧 Email
                    </label>
                    <input
                        id="reg-email"
                        type="email"
                        name="email"
                        className="register-form__input"
                        onChange={handleChange}
                        value={formData.email}
                        placeholder="your@email.com"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="register-form__field">
                    <label className="register-form__label" htmlFor="reg-password">
                        🔒 Пароль
                    </label>
                    <input
                        id="reg-password"
                        type="password"
                        name="password"
                        className="register-form__input"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="register-form__submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="register-form__spinner"></span>
                            <span>Регистрация...</span>
                        </>
                    ) : (
                        <span>🚀 Создать аккаунт</span>
                    )}
                </button>
            </form>

            <div className="register-form__footer">
                <p className="register-form__footer-text">
                    Уже есть аккаунт?{' '}
                    <span className="register-form__link" onClick={() => navigateTo("../Login")}>
                        Войти
                    </span>
                </p>
            </div>
        </div>
    )
}

export default RegisterComponent;
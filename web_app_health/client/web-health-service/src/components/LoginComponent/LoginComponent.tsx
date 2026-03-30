// /src/components/LoginComponent/LoginComponent.tsx

import axios from "axios";
import "./LoginComponent.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from "../../store/authSlice";

const LoginComponent = () => {
    const [formData, setformData] = useState({
        email: "",
        password: ""
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

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        const payload = formData;
        dispatch(loginStart());

        try {
            const res = await axios.post("https://localhost:7073/api/Auth/Login/login", payload);
            const { token, ErrorMessage } = res.data;

            if (ErrorMessage) {
                dispatch(loginFailure(ErrorMessage));
                setError(ErrorMessage);
                setIsLoading(false);
                return;
            }

            if (!token) {
                dispatch(loginFailure("Не получен токен"));
                setError("Не получен токен");
                setIsLoading(false);
                return;
            }

            // Получаем профиль
            const profileRes = await axios.get("https://localhost:7073/api/Client/GetMyProfile/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch(loginSuccess({ token, profile: profileRes.data }));
            localStorage.setItem("token", token);
            navigate('/Home');
        }
        catch (err: any) {
            dispatch(loginFailure(err.message || 'Ошибка сети'));
            setError(err.message || 'Ошибка сети');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-form">
            <div className="login-form__header">
                <span className="login-form__logo">💪</span>
                <h1 className="login-form__title">С возвращением!</h1>
                <p className="login-form__subtitle">Войдите в свой аккаунт</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form__body">
                {error && (
                    <div className="login-form__error">
                        <span className="login-form__error-icon">⚠️</span>
                        <span className="login-form__error-text">{error}</span>
                    </div>
                )}

                <div className="login-form__field">
                    <label className="login-form__label" htmlFor="login-email">
                        📧 Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        className="login-form__input"
                        onChange={handleChange}
                        value={formData.email}
                        placeholder="your@email.com"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="login-form__field">
                    <label className="login-form__label" htmlFor="login-password">
                        🔒 Пароль
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        className="login-form__input"
                        onChange={handleChange}
                        value={formData.password}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="login-form__submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="login-form__spinner"></span>
                            <span>Вход...</span>
                        </>
                    ) : (
                        <span>🚀 Войти</span>
                    )}
                </button>
            </form>

            <div className="login-form__footer">
                <p className="login-form__footer-text">
                    Нет аккаунта?{' '}
                    <span className="login-form__link" onClick={() => navigateTo("../Register")}>
                        Зарегистрироваться
                    </span>
                </p>
            </div>
        </div>
    )
}

export default LoginComponent;
import axios from "axios";
import "./ProfileComponent.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSignalR } from "../../hooks/useAuthSignalR";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { updateProfile } from "../../store/authSlice";
import { useProfile } from '../../hooks/useProfile';

const ProfileComponent = () => {
    const { profile, isLoading, loadMyProfile, isAuthenticated } = useProfile();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        midName: "",
        birthDate: "",
        email: "",
        phoneNumber: "",
        healthIssues: "",
        height: "",
        weight: ""
    });
    const dispatch = useDispatch();
    // const { profile, isLoading } = useSelector((state: RootState) => state.auth);
    
    const handleLogout = () => {
        // Logout уже есть в хуке useProfile через dispatch(logout())
        // Просто перенаправьте на страницу входа
        window.location.href = '/auth/login';
    };

    const navigate = useNavigate();
    useAuthSignalR(handleLogout);

    useEffect(() => {
        if (isAuthenticated && profile) {
            setFormData({
                lastName: profile.lastName || "",
                firstName: profile.firstName || "",
                midName: profile.midName || "",
                birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                healthIssues: profile.healthIssues || "",
                height: profile.height?.toString() || "",
                weight: profile.weight?.toString() || ""
            });
        }
    }, [profile, isAuthenticated]);

    if (isLoading) return <div className="loading">Загрузка...</div>;
    if (!profile) return <div className="not-authorized">Не авторизован</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `https://localhost:7073/api/Client/UpdateClient/${profile.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { data: updatedProfile } = await axios.get(
                `https://localhost:7073/api/Client/GetClientById?id=${profile.id}`, // или ваш эндпоинт для получения
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            dispatch(updateProfile(updatedProfile));

            await loadMyProfile(); // Перезагружаем профиль
            setIsFormVisible(false);
            alert('Профиль обновлен!');
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
            // Можно добавить обработку ошибок
        }
    };

    

    return (
        <div className="profile-page">
            {/* Основная информация профиля */}
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar-container">
                        <img
                            src={profile.profilePhotoUrl || '/default-avatar.png'}
                            alt="Аватар"
                            className="profile-avatar"
                        />
                    </div>
                    <h1>{profile.firstName} {profile.lastName}</h1>
                    <p className="profile-email">{profile.email}</p>
                </div>

                <div className="profile-info-grid">
                    <div className="info-item">
                        <span className="info-label">Фамилия:</span>
                        <span className="info-value">{profile.lastName}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Имя:</span>
                        <span className="info-value">{profile.firstName}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Отчество:</span>
                        <span className="info-value">{profile.midName || "—"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Дата рождения:</span>
                        <span className="info-value">{profile.birthDate || "—"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Телефон:</span>
                        <span className="info-value">{profile.phoneNumber || "—"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Рост:</span>
                        <span className="info-value">{profile.height ? `${profile.height} см` : "—"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Вес:</span>
                        <span className="info-value">{profile.weight ? `${profile.weight} кг` : "—"}</span>
                    </div>
                    <div className="info-item full-width">
                        <span className="info-label">Проблемы со здоровьем:</span>
                        <span className="info-value">{profile.healthIssues || "—"}</span>
                    </div>
                </div>

                <button
                    className="edit-profile-btn"
                    onClick={() => setIsFormVisible(!isFormVisible)}
                >
                    {isFormVisible ? '✖ Скрыть форму' : '✏ Редактировать профиль'}
                </button>
            </div>

            {/* Форма редактирования */}
            <div className={`edit-form-container ${isFormVisible ? 'visible' : 'hidden'}`}>
                <div className="edit-form-card">
                    <h2>Редактирование профиля</h2>

                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-grid">
                            {/* Левая колонка */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="lastName">Фамилия *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="firstName">Имя *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="midName">Отчество</label>
                                    <input
                                        type="text"
                                        id="midName"
                                        name="midName"
                                        value={formData.midName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="birthDate">Дата рождения</label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Правая колонка */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Телефон</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+7 (999) 999-99-99"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="height">Рост (см)</label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        min="50"
                                        max="250"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weight">Вес (кг)</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="20"
                                        max="200"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Поле для проблем со здоровьем на всю ширину */}
                        <div className="form-group full-width">
                            <label htmlFor="healthIssues">Проблемы со здоровьем</label>
                            <textarea
                                id="healthIssues"
                                name="healthIssues"
                                value={formData.healthIssues}
                                onChange={handleChange}
                                rows={Number.parseInt('3')}
                                placeholder="Опишите ваши проблемы со здоровьем, если они есть..."
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                💾 Сохранить изменения
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setIsFormVisible(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Кнопка выхода */}
            <div className="logout-section">
                <button onClick={handleLogout} className="logout-btn">
                    🚪 Выйти из аккаунта
                </button>
            </div>
        </div>
    );
};

export default ProfileComponent;
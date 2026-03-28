// /src/components/Header/HeaderComponent.tsx

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState } from "../../store";
import "./HeaderComponent.css";

const HeaderComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector((state: RootState) => state.auth.profile);
    const userName = profile?.firstName || 'Гость';
    console.log(profile);
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ✅ Синхронизация состояния аутентификации
    useEffect(() => {
        const checkAuth = () => {
            const hasToken = !!localStorage.getItem("token");
            setIsAuthenticated(hasToken);
            
            if (!hasToken) {
                dispatch(logout());
            }
        };

        checkAuth();
        
        const handleFocus = () => checkAuth();
        window.addEventListener('focus', handleFocus);
        
        return () => window.removeEventListener('focus', handleFocus);
    }, [dispatch]);

    const handleNavigation = (path: string, event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.currentTarget as HTMLDivElement;

        if (target.textContent === "Logout") {
            localStorage.removeItem("token");
            dispatch(logout());
            setIsAuthenticated(false);
        }
        
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    const navLinks = [
        { path: "../Home", label: "🏠 Home" },
        { path: "../Trainings", label: "🏋️ Programs" },
        { path: "../Diets", label: "🍎 Diets" },
        { path: "../Profile", label: "👤 Profile", authRequired: true },
    ];

    return (
        <>
            <header className="header">
                <div className="header__container">
                    {/* Логотип */}
                    <div className="header__logo">
                        <span className="header__logo-icon">💪</span>
                        <span className="header__logo-text">WebHealth</span>
                    </div>

                    {/* Десктоп навигация */}
                    <nav className="header__nav">
                        <ul className="header__nav-list">
                            {navLinks.map((link) => (
                                <li 
                                    key={link.path} 
                                    className={`header__nav-item ${link.authRequired && !isAuthenticated ? 'header__nav-item--hidden' : ''}`}
                                >
                                    <div 
                                        className="header__nav-link"
                                        onClick={(e) => handleNavigation(link.path, e)}
                                    >
                                        {link.label}
                                        {link.authRequired && isAuthenticated && (
                                            <span className="header__nav-link--user">{userName}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <li className="header__nav-item">
                                <div 
                                    className={`header__nav-link header__nav-link--${isAuthenticated ? 'logout' : 'login'}`}
                                    onClick={(e) => handleNavigation("../Auth/Login", e)}
                                >
                                    {isAuthenticated ? "🚪 Logout" : "🔑 Login"}
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Мобильная кнопка */}
                    <button 
                        className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Меню"
                    >
                        <span className="header__toggle-line"></span>
                        <span className="header__toggle-line"></span>
                        <span className="header__toggle-line"></span>
                    </button>
                </div>

                {/* Мобильное меню */}
                <div className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`}>
                    <ul className="header__mobile-nav-list">
                        {navLinks.map((link) => (
                            <li 
                                key={link.path} 
                                className={`header__mobile-nav-item ${link.authRequired && !isAuthenticated ? 'header__mobile-nav-item--hidden' : ''}`}
                            >
                                <div 
                                    className="header__mobile-nav-link"
                                    onClick={(e) => handleNavigation(link.path, e)}
                                >
                                    {link.label}
                                </div>
                            </li>
                        ))}
                        <li className="header__mobile-nav-item">
                            <div 
                                className="header__mobile-nav-link header__mobile-nav-link--accent"
                                onClick={(e) => handleNavigation("../Auth/Login", e)}
                            >
                                {isAuthenticated ? "🚪 Logout" : "🔑 Login"}
                            </div>
                        </li>
                    </ul>
                </div>
            </header>
        </>
    );
};

export default HeaderComponent;
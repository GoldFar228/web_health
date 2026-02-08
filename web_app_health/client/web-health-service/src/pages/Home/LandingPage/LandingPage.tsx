// src/components/home/LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import HeroSection from '../../../components/LandingComponent/HeroSection/HeroSection';
import FeaturesSection from '../../../components/LandingComponent/FeaturesSecion/FeaturesSection';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <HeroSection />
      
      <FeaturesSection />
      
      <section className="how-it-works">
        <div className="container">
          <h2>Как это работает?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Регистрация</h3>
              <p>Создайте аккаунт за 1 минуту</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Настройка целей</h3>
              <p>Укажите свои цели и параметры</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Отслеживание</h3>
              <p>Ведите дневник тренировок и питания</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Прогресс</h3>
              <p>Смотрите результаты и корректируйте план</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <h2>Начните свой путь к здоровью сегодня</h2>
          <p>Присоединяйтесь к тысячам пользователей, которые уже достигли своих целей</p>
          <div className="cta-buttons">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/auth/register')}
            >
              Начать бесплатно
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/auth/login')}
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
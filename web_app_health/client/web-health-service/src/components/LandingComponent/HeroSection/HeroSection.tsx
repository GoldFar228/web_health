
// import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Достигайте <span className="highlight">фитнес-целей</span><br />
            с умным трекером
          </h1>
          <p className="hero-subtitle">
            Тренировки, питание, прогресс — всё в одном приложении.<br />
            Персональный подход к вашему здоровью.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">пользователей</div>
            </div>
            <div className="stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">тренировок</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">достигают целей</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="/images/hero-dashboard.png" 
            alt="Демонстрация приложения"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23666">Изображение приложения</text></svg>';
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📱',
      title: 'Удобный трекинг',
      description: 'Отслеживайте тренировки и питание в пару кликов'
    },
    {
      icon: '📈',
      title: 'Детальная статистика',
      description: 'Наглядные графики прогресса по всем параметрам'
    },
    {
      icon: '🎯',
      title: 'Персональные цели',
      description: 'Ставьте цели и получайте рекомендации по их достижению'
    },
    {
      icon: '👥',
      title: 'Сообщество',
      description: 'Делитесь успехами и мотивируйте друг друга'
    },
    {
      icon: '🔔',
      title: 'Напоминания',
      description: 'Никогда не пропускайте тренировки и приемы пищи'
    },
    {
      icon: '🏆',
      title: 'Достижения',
      description: 'Зарабатывайте награды за регулярные занятия'
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Почему выбирают нас?</h2>
        <p className="section-subtitle">Все необходимое для вашего фитнес-пути в одном месте</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

// import './QuickStats.css';

interface QuickStatsProps {
  profile: any;
}

const QuickStats = ({ profile }: QuickStatsProps) => {
  // Временные данные (замените на реальные с бэкенда)
  const stats = [
    { label: 'Активных целей', value: '3', change: '+1', icon: '🎯' },
    { label: 'Тренировок за неделю', value: '5', change: '+2', icon: '🏋️' },
    { label: 'Средний сон', value: '7.2ч', change: '+0.5ч', icon: '😴' },
    { label: 'Дней подряд', value: '14', change: '+2', icon: '🔥' },
  ];

  return (
    <div className="quick-stats">
      <h2 className="section-title">Ваша статистика</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change positive">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
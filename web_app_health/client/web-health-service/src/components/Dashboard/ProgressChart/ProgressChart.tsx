
// import './ProgressChart.css';

const ProgressChart = () => {
  // Временные данные для графика
  const progressData = [
    { day: 'Пн', weight: 75, workouts: 2 },
    { day: 'Вт', weight: 74.8, workouts: 1 },
    { day: 'Ср', weight: 74.5, workouts: 2 },
    { day: 'Чт', weight: 74.3, workouts: 0 },
    { day: 'Пт', weight: 74.0, workouts: 3 },
    { day: 'Сб', weight: 73.8, workouts: 1 },
    { day: 'Вс', weight: 73.5, workouts: 2 },
  ];

  const maxWeight = Math.max(...progressData.map(d => d.weight));
  const minWeight = Math.max(...progressData.map(d => d.weight));

  return (
    <div className="progress-chart">
      <h2 className="section-title">Прогресс за неделю</h2>
      
      <div className="chart-container">
        <div className="chart">
          {progressData.map((item, index) => (
            <div key={index} className="chart-bar-container">
              <div className="chart-bar-wrapper">
                <div 
                  className="chart-bar" 
                  style={{ 
                    height: `${((item.weight - minWeight) / (maxWeight - minWeight)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="chart-label">{item.day}</div>
              <div className="chart-value">{item.weight}кг</div>
              <div className="chart-workouts">🏋️×{item.workouts}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="progress-summary">
        <div className="summary-item">
          <span className="summary-label">Старт</span>
          <span className="summary-value">75.0 кг</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Текущий</span>
          <span className="summary-value">73.5 кг</span>
        </div>
        <div className="summary-item positive">
          <span className="summary-label">Изменение</span>
          <span className="summary-value">-1.5 кг</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
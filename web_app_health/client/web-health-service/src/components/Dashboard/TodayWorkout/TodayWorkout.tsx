
// import './TodayWorkouts.css';

const TodayWorkouts = () => {
  // Временные данные
  const todayWorkouts = [
    { id: 1, title: 'Силовая тренировка', time: '18:00', status: 'запланировано' },
    { id: 2, title: 'Кардио', time: '20:00', status: 'запланировано' },
  ];

  const todayMeals = [
    { id: 1, title: 'Завтрак', calories: 450, status: 'записан' },
    { id: 2, title: 'Обед', calories: 650, status: 'не записан' },
    { id: 3, title: 'Ужин', calories: 0, status: 'ожидает' },
  ];

  return (
    <div className="today-workouts">
      <h2 className="section-title">Сегодня</h2>
      
      <div className="workouts-list">
        <h3>🏋️ Тренировки</h3>
        {todayWorkouts.length > 0 ? (
          todayWorkouts.map(workout => (
            <div key={workout.id} className="workout-item">
              <div className="workout-info">
                <span className="workout-title">{workout.title}</span>
                <span className="workout-time">{workout.time}</span>
              </div>
              <span className={`status-badge ${workout.status}`}>
                {workout.status}
              </span>
            </div>
          ))
        ) : (
          <p className="empty-state">На сегодня тренировок не запланировано</p>
        )}
      </div>
      
      <div className="meals-list">
        <h3>🍎 Питание</h3>
        {todayMeals.map(meal => (
          <div key={meal.id} className="meal-item">
            <div className="meal-info">
              <span className="meal-title">{meal.title}</span>
              <span className="meal-calories">
                {meal.calories > 0 ? `${meal.calories} ккал` : '—'}
              </span>
            </div>
            <span className={`status-badge ${meal.status}`}>
              {meal.status}
            </span>
          </div>
        ))}
        <div className="total-calories">
          Всего: <strong>1100 / 2400 ккал</strong>
        </div>
      </div>
    </div>
  );
};

export default TodayWorkouts;
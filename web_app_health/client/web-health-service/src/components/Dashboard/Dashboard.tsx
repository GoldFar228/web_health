
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import QuickStats from './QuickStats/QuickStats';
import TodayWorkouts from './TodayWorkout/TodayWorkout';
import ProgressChart from './ProgressChart/ProgressChart';
import QuickActions from './QuickActions/QuickActions';
import './Dashboard.css';

const Dashboard = () => {
  const { profile } = useSelector((state: RootState) => state.auth);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Добро пожаловать, {profile?.firstName || 'Друг'}! 👋</h1>
        <p className="dashboard-subtitle">Сегодня {new Date().toLocaleDateString('ru-RU', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })}</p>
      </header>

      <div className="dashboard-grid">
        <section className="quick-stats-section">
          <QuickStats profile={profile} />
        </section>

        <section className="today-section">
          <TodayWorkouts />
        </section>

        <section className="progress-section">
          <ProgressChart />
        </section>

        <section className="actions-section">
          <QuickActions />
        </section>

        <section className="motivation-section">
          <div className="motivation-card">
            <h3>💪 Мотивация дня</h3>
            <p>"Неважно, как медленно ты продвигаешься. Главное — ты не останавливаешься."</p>
            <p>Добавить API, которая будет подсасывать мотивашку вместо моковых данных</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
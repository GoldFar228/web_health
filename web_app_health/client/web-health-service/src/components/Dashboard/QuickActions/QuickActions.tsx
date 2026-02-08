
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      id: 1, 
      title: 'Начать тренировку', 
      icon: '▶️', 
      color: '#4CAF50',
      onClick: () => navigate('/workouts/start')
    },
    { 
      id: 2, 
      title: 'Добавить прием пищи', 
      icon: '🍎', 
      color: '#FF9800',
      onClick: () => navigate('/nutrition/add')
    },
    { 
      id: 3, 
      title: 'Запланировать тренировку', 
      icon: '📅', 
      color: '#2196F3',
      onClick: () => navigate('/workouts/schedule')
    },
    { 
      id: 4, 
      title: 'Посмотреть статистику', 
      icon: '📊', 
      color: '#9C27B0',
      onClick: () => navigate('/stats')
    },
  ];

  return (
    <div className="quick-actions">
      <h2 className="section-title">Быстрые действия</h2>
      <div className="actions-grid">
        {actions.map(action => (
          <button
            key={action.id}
            className="action-button"
            onClick={action.onClick}
            style={{ '--action-color': action.color } as React.CSSProperties}
          >
            <div className="action-icon">{action.icon}</div>
            <span className="action-title">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
import React from 'react';
import type { DailySummaryDto } from '../../../types/mealEntry';

interface DailySummaryProps {
  summary: DailySummaryDto;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ summary }) => {
  const progressWidth = (current: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  // Целевые значения (можно получать из профиля пользователя)
  const targets = {
    calories: 2000,
    protein: 150,
    carbohydrates: 250,
    fat: 70
  };

  return (
    <div className="daily-summary">
      <h3>📊 Сводка за {summary.date}</h3>
      
      <div className="summary-cards">
        <div className="summary-card calories">
          <div className="summary-value">{summary.totalCalories}</div>
          <div className="summary-label">ккал</div>
          <div className="summary-target">
            из {targets.calories}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressWidth(summary.totalCalories, targets.calories)}%` }}
            />
          </div>
        </div>

        <div className="summary-card protein">
          <div className="summary-value">{summary.totalProtein}г</div>
          <div className="summary-label">Белки</div>
          <div className="summary-target">
            из {targets.protein}г
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressWidth(summary.totalProtein, targets.protein)}%` }}
            />
          </div>
        </div>

        <div className="summary-card carbs">
          <div className="summary-value">{summary.totalCarbohydrates}г</div>
          <div className="summary-label">Углеводы</div>
          <div className="summary-target">
            из {targets.carbohydrates}г
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressWidth(summary.totalCarbohydrates, targets.carbohydrates)}%` }}
            />
          </div>
        </div>

        <div className="summary-card fat">
          <div className="summary-value">{summary.totalFat}г</div>
          <div className="summary-label">Жиры</div>
          <div className="summary-target">
            из {targets.fat}г
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressWidth(summary.totalFat, targets.fat)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="summary-stats">
        <span>🍽️ Приёмов пищи: {summary.mealCount}</span>
      </div>
    </div>
  );
};
using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class TrainingProgram : AbstractEntity
    {
        public string Name { get; set; } // "Силовая программа", "Кардио"
        public string Description { get; set; }
        public string Goal { get; set; } // Цель: "Похудение", "Выносливость", "Сила"
        public int DurationWeeks { get; set; } // Продолжительность в неделях
        public int DaysPerWeek { get; set; } // Тренировок в неделю
        public string Difficulty { get; set; } // "Начинающий", "Средний", "Продвинутый"

        public int ClientId { get; set; }
        public Client Client { get; set; }

        // Коллекция упражнений в программе
        public ICollection<TrainingProgramExercise> ProgramExercises { get; set; } = new List<TrainingProgramExercise>();
    }
}

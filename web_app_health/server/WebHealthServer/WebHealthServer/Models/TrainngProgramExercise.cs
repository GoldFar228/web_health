using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class TrainingProgramExercise : AbstractEntity
    {
        public int DayOfWeek { get; set; } // 1-7 (понедельник-воскресенье)
        public int Sets { get; set; } // Количество подходов
        public int Reps { get; set; } // Количество повторений
        public int Weight { get; set; } // Вес ("собственный вес", "10кг", "varies")
        public int RestBetweenSets { get; set; } // Отдых между подходами (сек)
        public string Notes { get; set; } // Дополнительные заметки
        public int Order { get; set; } // Порядок выполнения в тренировке

        public TrainingProgram TrainingProgram { get; set; }
        [ForeignKey(nameof(TrainingProgram))]
        public int TrainingProgramId { get; set; }

        public Exercise Exercise { get; set; }
        [ForeignKey(nameof(Exercise))]
        public int ExerciseId { get; set; }
    }
}

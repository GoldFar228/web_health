using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class TrainingProgramExercise : AbstractEntity
    {
        //public int DayOfWeek { get; set; } // 1-7 (понедельник-воскресенье)
        //public int Sets { get; set; } // Количество подходов
        //public int Reps { get; set; } // Количество повторений
        //public int Weight { get; set; } // Вес ("собственный вес", "10кг", "varies")
        //public int RestBetweenSets { get; set; } // Отдых между подходами (сек)
        //public string Notes { get; set; } // Дополнительные заметки
        //public int Order { get; set; } // Порядок выполнения в тренировке

        //public TrainingProgram TrainingProgram { get; set; }
        //[ForeignKey(nameof(TrainingProgram))]
        //public int TrainingProgramId { get; set; }

        //public Exercise Exercise { get; set; }
        //[ForeignKey(nameof(Exercise))]
        //public int ExerciseId { get; set; }
            public int TrainingProgramId { get; set; }

            [ForeignKey(nameof(TrainingProgramId))]
            public TrainingProgram TrainingProgram { get; set; }

            public int ExerciseId { get; set; }

            [ForeignKey(nameof(ExerciseId))]
            public Exercise Exercise { get; set; }

            public int Sets { get; set; }
            public int Reps { get; set; }
            public int? WeightKg { get; set; }

            public int Order { get; set; }  // Порядок в программе

            [MaxLength(500)]
            public string Notes { get; set; } = string.Empty;
        
    }
}

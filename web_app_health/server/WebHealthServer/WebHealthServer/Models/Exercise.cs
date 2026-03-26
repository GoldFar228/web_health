using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class Exercise : AbstractEntity
    {
        public int WgerExerciseId { get; set; }  // ID из внешнего API Wger

        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Category { get; set; }  // Например: "chest", "legs", "cardio"

        public string? MuscleGroup { get; set; }  // Например: "pectorals", "quadriceps"

        public string? ImageUrl { get; set; }  // Опционально: изображение из Wger
        // Связь с тренировочными сессиями
        [InverseProperty("Exercise")]
        public List<WorkoutSessionExercise> SessionExercises { get; set; } = new();

        // Связь с программами тренировок
        [InverseProperty("Exercise")]
        public List<TrainingProgramExercise> ProgramExercises { get; set; } = new();
    }
}

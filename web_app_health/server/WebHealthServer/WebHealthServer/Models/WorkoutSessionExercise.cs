using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class WorkoutSessionExercise : AbstractEntity
    {
        public int WorkoutSessionId { get; set; }

        [ForeignKey(nameof(WorkoutSessionId))]
        public WorkoutSession WorkoutSession { get; set; }

        public int ExerciseId { get; set; }

        [ForeignKey(nameof(ExerciseId))]
        public Exercise Exercise { get; set; }

        // Фактические выполненные значения
        public int ActualSets { get; set; }
        public int ActualReps { get; set; }
        public int? ActualWeightKg { get; set; }

        public int Order { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}

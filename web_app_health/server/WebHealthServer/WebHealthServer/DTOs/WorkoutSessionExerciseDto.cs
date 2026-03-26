using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WorkoutSessionExerciseDto
    {
        public int Id { get; set; }

        public int WorkoutSessionId { get; set; }

        public int ExerciseId { get; set; }

        public string? ExerciseName { get; set; }

        public string? MuscleGroup { get; set; }

        public int? PlannedSets { get; set; }
        public int? PlannedReps { get; set; }
        public int? PlannedWeightKg { get; set; }

        public int ActualSets { get; set; }
        public int ActualReps { get; set; }
        public int? ActualWeightKg { get; set; }

        public int Order { get; set; }

        public string Notes { get; set; } = string.Empty;
    }
}

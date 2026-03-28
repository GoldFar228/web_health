using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WorkoutSessionExerciseDto
    {
        public int Id { get; set; }
        public int ExerciseId { get; set; }
        public string ExerciseName { get; set; } = string.Empty;
        public string? MuscleGroup { get; set; }

        // ✅ Массив сетов
        public List<WorkoutSetDto> Sets { get; set; } = new();

        // ✅ Агрегаты
        public int CompletedSets { get; set; }
        public int TotalReps { get; set; }
        public decimal TotalTonnage { get; set; }

        public int Order { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}

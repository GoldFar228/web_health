using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdateWorkoutSessionExerciseDto
    {
        public int ExerciseId { get; set; }

        // ✅ Массив сетов (JSON)
        public List<WorkoutSetDto> Sets { get; set; } = new();

        public int Order { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class CreateWorkoutSessionDto
    {
        public DateTime Date { get; set; }

        public int DurationMinutes { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;

        public WorkoutStatus Status { get; set; } = WorkoutStatus.Planned;

        public List<CreateWorkoutSessionExerciseDto> Exercises { get; set; } = new();
    }
}

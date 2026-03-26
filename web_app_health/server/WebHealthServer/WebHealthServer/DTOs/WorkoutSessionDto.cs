using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WorkoutSessionDto
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string Notes { get; set; } = string.Empty;
        public WorkoutStatus Status { get; set; }
        public List<WorkoutSessionExerciseDto> Exercises { get; set; } = new();
    }
}

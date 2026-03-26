using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdateWorkoutSessionDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string Notes { get; set; } = string.Empty;
        public WorkoutStatus Status { get; set; }
    }
}

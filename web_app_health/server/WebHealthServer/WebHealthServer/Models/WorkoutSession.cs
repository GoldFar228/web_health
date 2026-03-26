using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{

    public class WorkoutSession : AbstractEntity
    {
        public int ClientId { get; set; }

        [ForeignKey(nameof(ClientId))]
        public Client Client { get; set; }

        // ✅ Убрали TrainingProgramId — сессия независима!

        public DateTime Date { get; set; }

        public int DurationMinutes { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;

        public WorkoutStatus Status { get; set; } = WorkoutStatus.Planned;

        [InverseProperty("WorkoutSession")]
        public List<WorkoutSessionExercise> SessionExercises { get; set; } = new();
    }
}

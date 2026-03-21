using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class Client : AbstractEntity
    {
        //public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string? MidName { get; set; }
        public DateOnly BirthDate { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? HealthIssues { get; set; }
        public string? Height { get; set; }
        public string? Weight { get; set; }

        // Связи с другими сущностями
        public Coach? Coach { get; set; }
        [ForeignKey(nameof(Coach))]
        public int? CoachId { get; set; }

        public Diet? Diet { get; set; } // Оставьте, если будете использовать позже
        [ForeignKey(nameof(Diet))]
        public int? DietId { get; set; }

        [InverseProperty("Clients")]
        public ICollection<TrainingProgram> TrainingPrograms { get; set; } = new List<TrainingProgram>();

        public UserRoleEnum Role { get; set; }

        // ✅ ВАЖНО: Добавьте связь с MealEntry
        [InverseProperty("Client")]
        public ICollection<MealEntry> MealEntries { get; set; } = new List<MealEntry>();
    }
}

using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdateClientDTO : AbstractEntity
    {
        public string? LastName { get; set; }
        public string? FirstName { get; set; }
        public string? MidName { get; set; }
        public DateOnly? BirthDate { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? HealthIssues { get; set; }
        public string? Height { get; set; }
        public string? Weight { get; set; }

        // ID связанных сущностей (можем менять тренера, диету и т.д.)
        //public int? CoachId { get; set; }
        //public int? DietId { get; set; }
        //public int? TrainingProgramId { get; set; }
    }
}

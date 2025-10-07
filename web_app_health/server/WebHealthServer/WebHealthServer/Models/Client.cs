using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class Client : AbstractEntity
    {
        //public int Id { get; set; } 
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MidName { get; set; }
        public DateOnly BirthDate{ get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string HealthIssues { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }

        public Coach? Coach { get; set; }

        [ForeignKey(nameof(Coach))]
        public int CoachId { get; set; }

        public Diet? Diet { get; set; }

        [ForeignKey(nameof(Diet))]
        public int DietId { get; set; }

        public TrainingProgram? TrainingProgram { get; set; }

        [ForeignKey(nameof(TrainingProgram))]
        public int TrainingProgramId { get; set; }


    }
}

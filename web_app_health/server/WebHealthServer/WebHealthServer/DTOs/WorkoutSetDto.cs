using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WorkoutSetDto
    {
        public int Order { get; set; }
        public int Reps { get; set; }
        public decimal WeightKg { get; set; }
        public bool Completed { get; set; }
    }
}

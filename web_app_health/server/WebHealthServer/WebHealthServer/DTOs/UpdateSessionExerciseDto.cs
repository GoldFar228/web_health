using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdateSessionExerciseDto
    {
        public int ActualSets { get; set; }
        public int ActualReps { get; set; }
        public int? ActualWeightKg { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}

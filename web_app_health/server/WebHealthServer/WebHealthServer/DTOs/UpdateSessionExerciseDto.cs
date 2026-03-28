using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdateSessionExerciseDto
    {
        // ✅ Обновляем сеты (полный массив)
        public List<WorkoutSetDto> Sets { get; set; } = new();

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}

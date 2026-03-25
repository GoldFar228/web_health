using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WgerMuscleDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("name_en")]
        public string? NameEn { get; set; }

        [JsonPropertyName("is_front")]
        public bool IsFront { get; set; }
    }

    public class WgerMuscleListDto
    {
        [JsonPropertyName("results")]
        public List<WgerMuscleDto> Results { get; set; } = new();
    }
}

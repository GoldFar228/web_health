using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WgerExerciseDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("uuid")]
        public string? Uuid { get; set; }

        // name может отсутствовать в list response!
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("category")]
        public int Category { get; set; }

        [JsonPropertyName("muscles")]
        public int[] Muscles { get; set; } = Array.Empty<int>();

        [JsonPropertyName("muscles_secondary")]
        public int[] MusclesSecondary { get; set; } = Array.Empty<int>();

        [JsonPropertyName("equipment")]
        public int[] Equipment { get; set; } = Array.Empty<int>();

        [JsonPropertyName("language")]
        public int? Language { get; set; }

        [JsonPropertyName("variations")]
        public int? Variations { get; set; }

        [JsonPropertyName("license_author")]
        public string? LicenseAuthor { get; set; }

        [JsonPropertyName("created")]
        public DateTime? Created { get; set; }

        [JsonPropertyName("last_update")]
        public DateTime? LastUpdate { get; set; }

        // Для list response - название загружается отдельно
        [JsonIgnore]
        public string? ExerciseName { get; set; }
    }

    public class WgerExerciseListDto
    {
        [JsonPropertyName("count")]
        public int Count { get; set; }

        [JsonPropertyName("next")]
        public string? Next { get; set; }

        [JsonPropertyName("previous")]
        public string? Previous { get; set; }

        [JsonPropertyName("results")]
        public List<WgerExerciseDto> Results { get; set; } = new();
    }
}

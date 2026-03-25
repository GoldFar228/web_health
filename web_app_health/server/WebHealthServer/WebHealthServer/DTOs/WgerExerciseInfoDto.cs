using System.Text.Json.Serialization;

namespace WebHealthServer.DTOs.Wger
{
    public class WgerExerciseInfoDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("uuid")]
        public string? Uuid { get; set; }

        [JsonPropertyName("category")]
        public WgerCategoryInfoDto? Category { get; set; }

        [JsonPropertyName("muscles")]
        public List<WgerMuscleInfoDto> Muscles { get; set; } = new();

        [JsonPropertyName("muscles_secondary")]
        public List<WgerMuscleInfoDto> MusclesSecondary { get; set; } = new();

        [JsonPropertyName("equipment")]
        public List<WgerEquipmentInfoDto> Equipment { get; set; } = new();

        [JsonPropertyName("translations")]
        public List<WgerTranslationDto> Translations { get; set; } = new();

        // ✅ УБРАЛИ [JsonIgnore] — теперь будет в JSON
        [JsonPropertyName("name")]
        public string? Name
        {
            get
            {
                var translation = Translations.FirstOrDefault(t => t.Language == 2);
                return translation?.Name ?? Translations.FirstOrDefault()?.Name;
            }
        }

        // ✅ УБРАЛИ [JsonIgnore] — теперь будет в JSON
        [JsonPropertyName("description")]
        public string? Description
        {
            get
            {
                var translation = Translations.FirstOrDefault(t => t.Language == 2);
                return translation?.Description;
            }
        }
    }

    public class WgerTranslationDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("uuid")]
        public string? Uuid { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("language")]
        public int Language { get; set; }
    }

    public class WgerCategoryInfoDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }
    }

    public class WgerMuscleInfoDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("name_en")]
        public string? NameEn { get; set; }

        [JsonPropertyName("is_front")]
        public bool IsFront { get; set; }

        [JsonPropertyName("image_url_main")]
        public string? ImageUrlMain { get; set; }
    }

    public class WgerEquipmentInfoDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }
    }
}
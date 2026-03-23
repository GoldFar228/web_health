namespace WebHealthServer.DTOs
{
    public class FoodSearchResultDto
    {
        public string Source { get; set; } = "fatsecret"; // "personal" | "fatsecret"
        public int? PersonalFoodId { get; set; }
        public string? FatSecretFoodId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }

        // 🔥 КБЖУ на порцию (для личных продуктов)
        public int? CaloriesPerServing { get; set; }
        public decimal? ProteinPerServing { get; set; }
        public decimal? CarbsPerServing { get; set; }
        public decimal? FatPerServing { get; set; }
        public decimal? ServingSize { get; set; }

        // 🔥 КБЖУ на 100г (для FatSecret и совместимости)
        public int CaloriesPer100g { get; set; }
        public decimal ProteinPer100g { get; set; }
        public decimal CarbsPer100g { get; set; }
        public decimal FatPer100g { get; set; }

        public string DefaultUnit { get; set; } = "g";
        public string? ServingInfo { get; set; }
    }
}
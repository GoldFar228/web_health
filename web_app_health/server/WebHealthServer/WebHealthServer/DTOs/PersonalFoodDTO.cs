namespace WebHealthServer.DTOs
{
    public class PersonalFoodDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }

        // 🔥 КБЖУ на порцию
        public int CaloriesPerServing { get; set; }
        public decimal ProteinPerServing { get; set; }
        public decimal CarbsPerServing { get; set; }
        public decimal FatPerServing { get; set; }

        // 🔥 Размер порции
        public decimal ServingSize { get; set; }
        public string DefaultUnit { get; set; } = "g";

        // 🔥 Для совместимости с FatSecret (расчёт на 100г)
        public int CaloriesPer100g => ServingSize > 0
            ? (int)(CaloriesPerServing * 100 / ServingSize)
            : CaloriesPerServing;

        public decimal ProteinPer100g => ServingSize > 0
            ? ProteinPerServing * 100 / ServingSize
            : ProteinPerServing;

        public decimal CarbsPer100g => ServingSize > 0
            ? CarbsPerServing * 100 / ServingSize
            : CarbsPerServing;

        public decimal FatPer100g => ServingSize > 0
            ? FatPerServing * 100 / ServingSize
            : FatPerServing;
    }
}
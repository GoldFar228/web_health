using System.ComponentModel.DataAnnotations;

namespace WebHealthServer.DTOs
{
    public class CreatePersonalFoodDto
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Brand { get; set; }

        // 🔥 КБЖУ на порцию
        [Required]
        public int CaloriesPerServing { get; set; }

        [Required]
        public decimal ProteinPerServing { get; set; }

        [Required]
        public decimal CarbsPerServing { get; set; }

        [Required]
        public decimal FatPerServing { get; set; }

        // 🔥 Размер порции
        [Required]
        public decimal ServingSize { get; set; } = 100;

        public string DefaultUnit { get; set; } = "g";

        // Авто-расчёт калорий из макросов
        public bool AutoCalculateCalories { get; set; } = false;
    }
}
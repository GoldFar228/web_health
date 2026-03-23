using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class PersonalFood : AbstractEntity
    {
        [Required]
        public int ClientId { get; set; }
        [ForeignKey("ClientId")]
        public Client? Client { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Brand { get; set; }

        // 🔥 КБЖУ на порцию (вместо на 100г)
        public int CaloriesPerServing { get; set; }
        public decimal ProteinPerServing { get; set; }
        public decimal CarbsPerServing { get; set; }
        public decimal FatPerServing { get; set; }

        // 🔥 Размер порции для расчёта на 100г при необходимости
        public decimal ServingSize { get; set; } = 100; // в граммах/мл/шт
        public string DefaultUnit { get; set; } = "g"; // g, ml, pcs

        // Для авто-расчёта калорий из макросов
        public bool IsCaloriesAutoCalculated { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UsedAt { get; set; } = DateTime.UtcNow;

        // Для поиска
        public string SearchKey => $"{Name} {Brand}".ToLowerInvariant();
    }
}

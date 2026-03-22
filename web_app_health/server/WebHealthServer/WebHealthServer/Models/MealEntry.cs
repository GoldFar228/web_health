using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class MealEntry : AbstractEntity
    {
        [Required]
        public int ClientId { get; set; }

        [ForeignKey(nameof(ClientId))]
        [InverseProperty("MealEntries")]
        public Client Client { get; set; }

        [Required]
        public DateOnly EntryDate { get; set; }

        public TimeOnly? EntryTime { get; set; } = TimeOnly.FromDateTime(DateTime.UtcNow);

        [Required]
        [MaxLength(20)]
        public string MealType { get; set; } = "other"; // breakfast, lunch, dinner, snack

        [Required]
        [MaxLength(200)]
        public string FoodName { get; set; }

        [MaxLength(100)]
        public string? Brand { get; set; }

        // Количественные показатели
        [Required]
        [Range(0.1, 10000)]
        public decimal Quantity { get; set; } // Количество

        [MaxLength(10)]
        public string Unit { get; set; } = "g"; // g, ml, pcs

        // Пищевая ценность (можно вводить вручную или рассчитывать)
        [Range(0, 10000)]
        public decimal Calories { get; set; }

        [Range(0, 1000)]
        public decimal Protein { get; set; }

        [Range(0, 1000)]
        public decimal Carbohydrates { get; set; }

        [Range(0, 1000)]
        public decimal Fat { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        [MaxLength(50)]
        public string? FatSecretFoodId { get; set; } // 🔗 Ссылка на продукт в FatSecret

        // Дополнительно
        [MaxLength(500)]
        public string? Notes { get; set; }

        // Для быстрого поиска/агрегации
        public int Year => EntryDate.Year;
        public int Month => EntryDate.Month;
        public int Day => EntryDate.Day;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class PersonalFood : AbstractEntity
    {
        [Required]
        public int ClientId { get; set; }

        [ForeignKey(nameof(ClientId))]
        [InverseProperty("PersonalFoods")]
        public Client Client { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Brand { get; set; }

        // Пищевая ценность на 100г (базовая единица для расчётов)
        [Required, Range(0, 10000)]
        public decimal CaloriesPer100g { get; set; }

        [Required, Range(0, 1000)]
        public decimal ProteinPer100g { get; set; }

        [Required, Range(0, 1000)]
        public decimal CarbsPer100g { get; set; }

        [Required, Range(0, 1000)]
        public decimal FatPer100g { get; set; }

        [MaxLength(50)]
        public string DefaultUnit { get; set; } = "g"; // g, ml, pcs

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UsedAt { get; set; } // Для сортировки по частоте использования

        // Для поиска
        public string SearchKey => $"{Name} {Brand}".ToLowerInvariant();
    }
}

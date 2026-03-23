using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class CreatePersonalFoodDto : AbstractEntity
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Brand { get; set; }

        [Range(0, 10000)]
        public decimal CaloriesPer100g { get; set; }

        [Range(0, 1000)]
        public decimal ProteinPer100g { get; set; }

        [Range(0, 1000)]
        public decimal CarbsPer100g { get; set; }

        [Range(0, 1000)]
        public decimal FatPer100g { get; set; }

        [MaxLength(50)]
        public string DefaultUnit { get; set; } = "g";
    }
}

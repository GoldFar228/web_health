using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class FoodSearchResultDto : AbstractEntity
    {
        public string Source { get; set; } = "fatsecret"; // "fatsecret" | "personal"
        public string? FatSecretFoodId { get; set; }
        public int? PersonalFoodId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public decimal CaloriesPer100g { get; set; }
        public decimal ProteinPer100g { get; set; }
        public decimal CarbsPer100g { get; set; }
        public decimal FatPer100g { get; set; }
        public string DefaultUnit { get; set; } = "g";
    }
}

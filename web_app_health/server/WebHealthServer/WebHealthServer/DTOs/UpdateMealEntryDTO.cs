using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdateMealEntryDto
    {
        public TimeOnly? EntryTime { get; set; }

        [MaxLength(20)]
        public string? MealType { get; set; }

        [MaxLength(200)]
        public string? FoodName { get; set; }

        [Range(0.1, 10000)]
        public decimal? Quantity { get; set; }

        [MaxLength(10)]
        public string? Unit { get; set; }

        [Range(0, 10000)]
        public decimal? Calories { get; set; }

        [Range(0, 1000)]
        public decimal? Protein { get; set; }

        [Range(0, 1000)]
        public decimal? Carbohydrates { get; set; }

        [Range(0, 1000)]
        public decimal? Fat { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }
    }
}

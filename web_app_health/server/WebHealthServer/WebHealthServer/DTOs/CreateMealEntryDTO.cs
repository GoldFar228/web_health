using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class CreateMealEntryDto
    {
        public DateOnly EntryDate { get; set; }

        [DataType(DataType.Time)]
        [SwaggerSchema(Format = "time")]
        public string? EntryTime { get; set; }
        public string MealType { get; set; } = "other";
        public string FoodName { get; set; }
        public string? Brand { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "g"; 
        public string? FatSecretFoodId { get; set; } // 🔗 Опционально: если берём из API
        [MaxLength(50)]
        public string? FatSecretServingId { get; set; }
        public decimal? Calories { get; set; }
        public decimal? Protein { get; set; }
        public decimal? Carbohydrates { get; set; }
        public decimal? Fat { get; set; }
        public string? Notes { get; set; }

    }
}

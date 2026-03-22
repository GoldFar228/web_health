using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class MealEntryResponseDto
    {
        public int Id { get; set; }
        public DateOnly EntryDate { get; set; }

        public string? EntryTime { get; set; }
        public string MealType { get; set; }
        public string FoodName { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Calories { get; set; }
        public decimal Protein { get; set; }
        public decimal Carbohydrates { get; set; }
        public decimal Fat { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

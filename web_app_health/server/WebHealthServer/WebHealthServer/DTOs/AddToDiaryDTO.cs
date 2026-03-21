using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class AddToDiaryDto
    {

        // 🔹 Если продукт из FatSecret:
        public long? FatSecretFoodId { get; set; }

        // 🔹 Или ручной ввод (если FatSecretFoodId = null):
        public string? FoodName { get; set; }
        public string? Brand { get; set; }
        public decimal? Calories { get; set; }
        public decimal? Protein { get; set; }
        public decimal? Carbohydrates { get; set; }
        public decimal? Fat { get; set; }

        // 🔹 Общие поля:
        public int ClientId { get; set; } // или бери из токена
        public decimal Quantity { get; set; }
        public string? Unit { get; set; } = "g";
        public string? MealType { get; set; } = "other";
        public DateOnly EntryDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
        public TimeOnly? EntryTime { get; set; }
        public string? Notes { get; set; }
    }

}


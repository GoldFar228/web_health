using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class ServingData
    {
        public string serving_id { get; set; }
        public string serving_description { get; set; }

        // Числовые поля, которые FatSecret отдаёт как строки:
        public string calories { get; set; }              // ← было decimal, стало string
        public string protein { get; set; }               // ← было decimal, стало string
        public string carbohydrate { get; set; }          // ← было decimal, стало string
        public string fat { get; set; }                   // ← было decimal, стало string
        public string metric_serving_amount { get; set; } // ← было decimal, стало string
        public string metric_serving_unit { get; set; }

        // Если нужны числа — добавь свойства-обёртки:
        public decimal? CaloriesDecimal =>
            decimal.TryParse(calories, out var c) ? c : null;

        public decimal? ProteinDecimal =>
            decimal.TryParse(protein, out var p) ? p : null;

        public decimal? MetricServingAmountDecimal =>
            decimal.TryParse(metric_serving_amount, out var m) ? m : null;
    }
}


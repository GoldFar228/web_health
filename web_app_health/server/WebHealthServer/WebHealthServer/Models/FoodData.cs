using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class FoodData
    {
        public string food_id { get; set; }
        public string food_name { get; set; }
        public string food_type { get; set; } // "Brand" или "Generic"
        public string brand_name { get; set; }
        public string food_url { get; set; }
        public ServingsData? servings { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class FoodsSearchData
    {
        public List<FoodData>? food { get; set; }
    }
}

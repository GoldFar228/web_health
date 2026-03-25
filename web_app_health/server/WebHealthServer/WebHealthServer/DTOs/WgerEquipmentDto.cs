using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class WgerEquipmentDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    public class WgerEquipmentListDto
    {
        [JsonPropertyName("results")]
        public List<WgerEquipmentDto> Results { get; set; } = new();
    }
}

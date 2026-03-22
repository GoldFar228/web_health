using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebHealthServer.Models
{
    public class FatSecretTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; } = string.Empty;

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonIgnore]
        public DateTime ExpiresAt { get; set; }

        [JsonIgnore]
        public bool IsValid => DateTime.UtcNow < ExpiresAt.AddMinutes(-5); // 5 мин запас
    }
}


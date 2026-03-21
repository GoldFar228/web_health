using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class FatSecretTokenResponse
    {
        public string access_token { get; set; }
        public string token_type { get; set; } // "Bearer"
        public int expires_in { get; set; }    // 86400 (24 часа)
    }
}


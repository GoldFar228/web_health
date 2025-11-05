using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class AuthResponse : AbstractEntity
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public DateTime Expires { get; set; }   
    }
}

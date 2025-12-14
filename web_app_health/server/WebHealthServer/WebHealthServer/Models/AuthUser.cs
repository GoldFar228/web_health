using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class AuthUser : AbstractEntity
    {

        public string Token { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public DateTime Expires { get; set; }
        //public string Email { get; set; }
        //public string Username { get; set; }
        //public string PasswordHash { get; set; }
        //public UserRoleEnum Role { get; set; }
        //public string? Phone { get; set; }
        //public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //public bool IsActive { get; set; } = true;

        //// Связь с клиентом (если нужно)
        //public int? ClientId { get; set; }
        //public Client? Client { get; set; }
    }
}

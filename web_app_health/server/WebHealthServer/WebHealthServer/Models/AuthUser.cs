using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class AuthUser : AbstractEntity
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public UserRoleEnum Role { get; set; }
    }
}

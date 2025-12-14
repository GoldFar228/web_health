using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class RegisterRequest
    {
        [Column(TypeName = "Varchar(64)")]
        public string? LastName { get; set; }
        [Column(TypeName = "Varchar(64)")]
        public string? FirstName { get; set; }
        [Column(TypeName = "Varchar(64)")]
        public string? Email { get; set; }

        [Column(TypeName = "Varchar(64)")]
        public string? Password { get; set; }

        [Column(TypeName = "Varchar(16)")]
        public string? Phone { get; set; }

        public UserRoleEnum Role { get; set; } = UserRoleEnum.User;
    }
}

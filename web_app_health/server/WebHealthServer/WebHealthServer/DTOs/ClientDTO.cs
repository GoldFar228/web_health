using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class ClientDTO : AbstractEntity
    {
        //public int Id { get; set; } 
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MidName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class Coach : AbstractEntity
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MidName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int WorkExp { get; set; }
    }
}

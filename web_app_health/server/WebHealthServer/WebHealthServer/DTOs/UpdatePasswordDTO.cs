using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Models
{
    public class UpdatePasswordDTO : AbstractEntity
    {
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}

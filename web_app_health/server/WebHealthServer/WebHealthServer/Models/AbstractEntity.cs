using System.ComponentModel.DataAnnotations;

namespace WebHealthServer.Models
{
    public abstract class AbstractEntity
    {
        [Key]
        public int Id { get; set; }
    }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class Exercise : AbstractEntity
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string MuscleGroup { get; set; }
        public string Equipment { get; set; }
        public string Difficulty { get; set; }
        public string Technique{ get; set; }
    }
}

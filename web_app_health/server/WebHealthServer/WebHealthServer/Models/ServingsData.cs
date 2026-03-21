using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class ServingsData
    {
        public List<ServingData> serving { get; set; }
    }
}


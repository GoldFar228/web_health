using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class CoachRepository : AbstractRepository<Coach>
    {
        public CoachRepository(AppDbContext context) : base(context)
        {
        }


    }
}

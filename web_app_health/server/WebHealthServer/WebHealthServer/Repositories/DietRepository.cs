using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class DietRepository : AbstractRepository<Diet>
    {
        public DietRepository(AppDbContext context) : base(context)
        {
        }


    }
}

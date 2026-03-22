using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class DietRepository : FatSecretOptions<Diet>
    {
        public DietRepository(AppDbContext context) : base(context)
        {
        }


    }
}

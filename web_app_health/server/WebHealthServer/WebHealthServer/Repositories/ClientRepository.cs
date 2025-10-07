using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class ClientRepository : AbstractRepository<Client>
    {
        public ClientRepository(AppDbContext context) : base(context)
        {
        }


    }
}

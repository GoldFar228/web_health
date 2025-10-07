using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class ExerciseRepository : AbstractRepository<Exercise>
    {
        public ExerciseRepository(AppDbContext context) : base(context)
        {
        }


    }
}

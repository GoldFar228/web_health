using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class ExerciseRepository : FatSecretOptions<Exercise>
    {
        public ExerciseRepository(AppDbContext context) : base(context)
        {
        }


    }
}

using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class TrainingProgramRepository : FatSecretOptions<TrainingProgram>
    {
        public TrainingProgramRepository(AppDbContext context) : base(context)
        {
        }


    }
}

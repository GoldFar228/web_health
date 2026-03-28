using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class TrainingProgramRepository : AbstractRepository<TrainingProgram>
    {
        public TrainingProgramRepository(AppDbContext context) : base(context)
        {
        }


    }
}

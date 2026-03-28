using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class TrainingProgramExerciseRepository : AbstractRepository<TrainingProgramExercise>
    {
        public TrainingProgramExerciseRepository(AppDbContext context) : base(context)
        {
        }


    }
}

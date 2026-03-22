using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class TrainingProgramExerciseRepository : FatSecretOptions<TrainingProgramExercise>
    {
        public TrainingProgramExerciseRepository(AppDbContext context) : base(context)
        {
        }


    }
}

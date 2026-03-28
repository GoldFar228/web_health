using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
        public class ExerciseRepository : AbstractRepository<Exercise>
        {
            public ExerciseRepository(AppDbContext context) : base(context)
            {
            }

            public async Task<bool> ExistsByWgerIdAsync(int wgerExerciseId)
            {
                return await _dbSet.AnyAsync(e => e.WgerExerciseId == wgerExerciseId);
            }

            public async Task<Exercise?> GetByWgerIdAsync(int wgerExerciseId)
            {
                return await _dbSet.FirstOrDefaultAsync(e => e.WgerExerciseId == wgerExerciseId);
            }

            public async Task<List<Exercise>> SearchByNameAsync(string searchTerm)
            {
                return await _dbSet
                    .Where(e => e.Name.Contains(searchTerm))
                    .OrderBy(e => e.Name)
                    .ToListAsync();
            }

            public async Task<List<Exercise>> GetByCategoryAsync(string category)
            {
                return await _dbSet
                    .Where(e => e.Category == category)
                    .OrderBy(e => e.Name)
                    .ToListAsync();
            }

            public async Task<List<Exercise>> GetByMuscleGroupAsync(string muscleGroup)
            {
                return await _dbSet
                    .Where(e => e.MuscleGroup == muscleGroup)
                    .OrderBy(e => e.Name)
                    .ToListAsync();
            }
        }


    
}

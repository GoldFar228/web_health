using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public interface IWorkoutSessionRepository
    {
        Task<WorkoutSession?> GetByIdAsync(int id);
        Task<List<WorkoutSession>> GetAllByClientIdAsync(int clientId);
        Task<WorkoutSession> CreateAsync(WorkoutSession session);
        Task<WorkoutSession> UpdateAsync(WorkoutSession session);
        Task DeleteAsync(int id);
        Task<WorkoutSession?> GetByIdWithExercisesAsync(int id);
        Task<List<WorkoutSession>> GetByClientIdWithExercisesAsync(int clientId);
        Task<WorkoutSessionExercise> AddExerciseToSessionAsync(WorkoutSessionExercise sessionExercise);
    }
}

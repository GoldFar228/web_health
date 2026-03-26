using AutoMapper;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IWorkoutSessionService
    {
        Task<WorkoutSessionDto> CreateSessionAsync(int clientId, CreateWorkoutSessionDto dto);
        Task<WorkoutSessionDto?> GetSessionByIdAsync(int id);
        Task<List<WorkoutSessionDto>> GetAllSessionsByClientAsync(int clientId);
        Task<WorkoutSessionDto> UpdateSessionAsync(int id, UpdateWorkoutSessionDto dto);
        Task DeleteSessionAsync(int id);
        Task<WorkoutSessionDto> UpdateExerciseInSessionAsync(int sessionId, int exerciseId, UpdateSessionExerciseDto dto);
        Task AddExerciseToSessionAsync(int sessionId, CreateWorkoutSessionExerciseDto dto);
        Task RemoveExerciseFromSessionAsync(int sessionId, int exerciseId);
    }
}

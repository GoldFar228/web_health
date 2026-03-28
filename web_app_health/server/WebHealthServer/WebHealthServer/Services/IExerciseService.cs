using AutoMapper;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IExerciseService
    {
        Task<Exercise?> GetExerciseByIdAsync(int id);
        Task<List<Exercise>> GetExercisesAsync();
        Task<Exercise> AddExerciseAsync(CreateExerciseDto dto);
        Task<Exercise?> UpdateExerciseAsync(int id, UpdateExerciseDto dto);
        Task<bool> DeleteExerciseAsync(int id);
        Task<bool> ExistsExerciseAsync(int id);
        Task<Exercise?> GetByWgerIdAsync(int wgerExerciseId);
        Task<List<Exercise>> SearchByNameAsync(string searchTerm);
        Task<List<Exercise>> GetByCategoryAsync(string category);
        Task<List<Exercise>> GetByMuscleGroupAsync(string muscleGroup);
        Task<BatchExerciseResult> AddExercisesBatchAsync(List<CreateExerciseDto> dtos);
    }
}

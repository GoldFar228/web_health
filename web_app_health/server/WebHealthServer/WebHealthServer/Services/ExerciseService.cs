using AutoMapper;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly ExerciseRepository _exerciseRepository;
        private readonly IMapper _mapper;

        public ExerciseService(ExerciseRepository exerciseRepository, IMapper mapper)
        {
            _exerciseRepository = exerciseRepository;
            _mapper = mapper;
        }

        public async Task<Exercise?> GetExerciseByIdAsync(int id)
        {
            return await _exerciseRepository.GetByIdAsync(id);
        }

        public async Task<List<Exercise>> GetExercisesAsync()
        {
            return (List<Exercise>)await _exerciseRepository.GetAllAsync();
        }

        public async Task<Exercise> AddExerciseAsync(CreateExerciseDto dto)
        {
            var exercise = _mapper.Map<Exercise>(dto);
            return await _exerciseRepository.AddAsync(exercise);
        }

        public async Task<Exercise?> UpdateExerciseAsync(int id, UpdateExerciseDto dto)
        {
            var existing = await _exerciseRepository.GetByIdAsync(id);
            if (existing == null)
                return null;

            _mapper.Map(dto, existing);
            return await _exerciseRepository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteExerciseAsync(int id)
        {
            return await _exerciseRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsExerciseAsync(int id)
        {
            return await _exerciseRepository.ExistAsync(id);
        }

        public async Task<Exercise?> GetByWgerIdAsync(int wgerExerciseId)
        {
            return await _exerciseRepository.GetByWgerIdAsync(wgerExerciseId);
        }

        public async Task<List<Exercise>> SearchByNameAsync(string searchTerm)
        {
            return await _exerciseRepository.SearchByNameAsync(searchTerm);
        }

        public async Task<List<Exercise>> GetByCategoryAsync(string category)
        {
            return await _exerciseRepository.GetByCategoryAsync(category);
        }

        public async Task<List<Exercise>> GetByMuscleGroupAsync(string muscleGroup)
        {
            return await _exerciseRepository.GetByMuscleGroupAsync(muscleGroup);
        }

        public async Task<BatchExerciseResult> AddExercisesBatchAsync(List<CreateExerciseDto> dtos)
        {
            var result = new BatchExerciseResult();
            var addedExercises = new List<Exercise>();

            foreach (var dto in dtos)
            {
                // Пропускаем дубликаты по WgerId
                if (dto.WgerExerciseId.HasValue)
                {
                    var exists = await ExistsByWgerIdAsync(dto.WgerExerciseId.Value);
                    if (exists)
                    {
                        result.Skipped++;
                        continue;
                    }
                }

                // Пропускаем дубликаты по имени
                var existsByName = await _exerciseRepository
                    .GetAllAsync();
                if (existsByName.Any(e => e.Name.Equals(dto.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    result.Skipped++;
                    continue;
                }

                var exercise = _mapper.Map<Exercise>(dto);
                var added = await _exerciseRepository.AddAsync(exercise);
                addedExercises.Add(added);
                result.Added++;
            }

            result.TotalProcessed = dtos.Count;
            result.Exercises = addedExercises;

            return result;
        }

        private async Task<bool> ExistsByWgerIdAsync(int wgerExerciseId)
        {
            return await _exerciseRepository.ExistsByWgerIdAsync(wgerExerciseId);
        }
    }
}

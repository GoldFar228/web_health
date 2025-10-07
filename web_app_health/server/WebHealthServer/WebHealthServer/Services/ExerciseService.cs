using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class ExerciseService
    {
        private readonly ExerciseRepository _exerciseRepository;
        private readonly IMapper _mapper;

        public ExerciseService(ExerciseRepository exerciseRepository, IMapper mapper)
        {
            _exerciseRepository = exerciseRepository;
            _mapper = mapper;
        }

        public async Task<Exercise> GetExerciseByIdAsync(int id)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(id); //для более краткого решения, можно эту строку в return запихнуть
            return exercise;
        }

        public async Task<IEnumerable<Exercise>> GetExercisesAsync()
        {
            return await _exerciseRepository.GetAllAsync();
        }

        public async Task<Exercise> AddExerciseAsync(Exercise exercise)
        {
            return await _exerciseRepository.AddAsync(exercise); 
        }

        public async Task<Exercise> UpdateExerciseAsync(Exercise exercise)
        {
            if(exercise == null)
                throw new ArgumentNullException(nameof(exercise));

            return await _exerciseRepository.UpdateAsync(exercise);
        }

        public async Task<bool> DeleteExerciseAsync(int id)
        {
            return await _exerciseRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsExerciseAsync(int id)
        {
            return await _exerciseRepository.ExistAsync(id);
        }
    }
}

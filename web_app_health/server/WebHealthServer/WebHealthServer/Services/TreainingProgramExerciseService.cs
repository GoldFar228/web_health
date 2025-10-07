using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class TrainingProgramExerciseService
    {
        private readonly TrainingProgramExerciseRepository _trainingProgramExerciseRepository;
        private readonly IMapper _mapper;

        public TrainingProgramExerciseService(TrainingProgramExerciseRepository trainingProgramExerciseRepository, IMapper mapper)
        {
            _trainingProgramExerciseRepository = trainingProgramExerciseRepository;
            _mapper = mapper;
        }

        public async Task<TrainingProgramExercise> GetTrainingProgramExerciseByIdAsync(int id)
        {
            var trainingProgramExercise = await _trainingProgramExerciseRepository.GetByIdAsync(id); //для более краткого решения, можно эту строку в return запихнуть
            return trainingProgramExercise;
        }

        public async Task<IEnumerable<TrainingProgramExercise>> GetTrainingProgramExercisesAsync()
        {
            return await _trainingProgramExerciseRepository.GetAllAsync();
        }

        public async Task<TrainingProgramExercise> AddTrainingProgramExerciseAsync(TrainingProgramExercise trainingProgramExercise)
        {
            return await _trainingProgramExerciseRepository.AddAsync(trainingProgramExercise); 
        }

        public async Task<TrainingProgramExercise> UpdateTrainingProgramExerciseAsync(TrainingProgramExercise trainingProgramExercise)
        {
            if(trainingProgramExercise == null)
                throw new ArgumentNullException(nameof(trainingProgramExercise));

            return await _trainingProgramExerciseRepository.UpdateAsync(trainingProgramExercise);
        }

        public async Task<bool> DeleteTrainingProgramExerciseAsync(int id)
        {
            return await _trainingProgramExerciseRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsTrainingProgramExerciseAsync(int id)
        {
            return await _trainingProgramExerciseRepository.ExistAsync(id);
        }
    }
}

using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class TrainingProgramService
    {
        private readonly TrainingProgramRepository _trainingProgramRepository;
        private readonly IMapper _mapper;

        public TrainingProgramService(TrainingProgramRepository trainingProgramRepository, IMapper mapper)
        {
            _trainingProgramRepository = trainingProgramRepository;
            _mapper = mapper;
        }

        public async Task<TrainingProgram> GetTrainingProgramByIdAsync(int id)
        {
            var trainingProgram = await _trainingProgramRepository.GetByIdAsync(id); //для более краткого решения, можно эту строку в return запихнуть
            return trainingProgram;
        }

        public async Task<IEnumerable<TrainingProgram>> GetTrainingProgramsAsync()
        {
            return await _trainingProgramRepository.GetAllAsync();
        }

        public async Task<TrainingProgram> AddTrainingProgramAsync(TrainingProgram trainingProgram)
        {
            return await _trainingProgramRepository.AddAsync(trainingProgram); 
        }

        public async Task<TrainingProgram> UpdateTrainingProgramAsync(TrainingProgram trainingProgram)
        {
            if(trainingProgram == null)
                throw new ArgumentNullException(nameof(trainingProgram));

            return await _trainingProgramRepository.UpdateAsync(trainingProgram);
        }

        public async Task<bool> DeleteTrainingProgramAsync(int id)
        {
            return await _trainingProgramRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsTrainingProgramAsync(int id)
        {
            return await _trainingProgramRepository.ExistAsync(id);
        }
    }
}

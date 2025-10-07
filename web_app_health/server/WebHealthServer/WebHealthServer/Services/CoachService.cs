using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class CoachService
    {
        private readonly CoachRepository _coachRepository;
        private readonly IMapper _mapper;

        public CoachService(CoachRepository coachRepository, IMapper mapper)
        {
            _coachRepository = coachRepository;
            _mapper = mapper;
        }

        public async Task<Coach> GetCoachByIdAsync(int id)
        {
            var coach = await _coachRepository.GetByIdAsync(id); //для более краткого решения, можно эту строку в return запихнуть
            return coach;
        }

        public async Task<IEnumerable<Coach>> GetCoachsAsync()
        {
            return await _coachRepository.GetAllAsync();
        }

        public async Task<Coach> AddCoachAsync(Coach coach)
        {
            return await _coachRepository.AddAsync(coach); 
        }

        public async Task<Coach> UpdateCoachAsync(Coach coach)
        {
            if(coach == null)
                throw new ArgumentNullException(nameof(coach));

            return await _coachRepository.UpdateAsync(coach);
        }

        public async Task<bool> DeleteCoachAsync(int id)
        {
            return await _coachRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsCoachAsync(int id)
        {
            return await _coachRepository.ExistAsync(id);
        }
    }
}

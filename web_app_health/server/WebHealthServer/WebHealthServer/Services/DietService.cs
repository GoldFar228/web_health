using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class DietService
    {
        private readonly DietRepository _dietRepository;
        private readonly IMapper _mapper;

        public DietService(DietRepository dietRepository, IMapper mapper)
        {
            _dietRepository = dietRepository;
            _mapper = mapper;
        }

        public async Task<Diet> GetDietByIdAsync(int id)
        {
            var diet = await _dietRepository.GetByIdAsync(id); //для более краткого решения, можно эту строку в return запихнуть
            return diet;
        }

        public async Task<IEnumerable<Diet>> GetDietsAsync()
        {
            return await _dietRepository.GetAllAsync();
        }

        public async Task<Diet> AddDietAsync(Diet diet)
        {
            return await _dietRepository.AddAsync(diet); 
        }

        public async Task<Diet> UpdateDietAsync(Diet diet)
        {
            if(diet == null)
                throw new ArgumentNullException(nameof(diet));

            return await _dietRepository.UpdateAsync(diet);
        }

        public async Task<bool> DeleteDietAsync(int id)
        {
            return await _dietRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsDietAsync(int id)
        {
            return await _dietRepository.ExistAsync(id);
        }
    }
}

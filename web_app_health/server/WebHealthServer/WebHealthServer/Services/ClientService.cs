using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Models.Enums;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class ClientService
    {
        private readonly ClientRepository _clientRepository;
        private readonly IMapper _mapper;
        private readonly IRepository<Coach> _coachRepository;
        private readonly IRepository<Diet> _dietRepository;
        private readonly IRepository<TrainingProgram> _trainingProgramRepository;


        public ClientService(ClientRepository clientRepository, 
            IMapper mapper,
            IRepository<Coach> coachRepository,
            IRepository<Diet> dietRepository,
            IRepository<TrainingProgram> trainingProgramRepository)
        {
            _clientRepository = clientRepository;
            _mapper = mapper;
            _dietRepository = dietRepository;
            _coachRepository = coachRepository;
            _trainingProgramRepository = trainingProgramRepository;
        }

        public async Task<Client> GetClientByIdAsync(int id)
        {
            var client = await _clientRepository.GetByIdAsync(id); //для более краткого решения, можно эту строку в return запихнуть
            return client;
        }

        public async Task<IEnumerable<Client>> GetClientsAsync()
        {
            return await _clientRepository.GetAllAsync();
        }

        public async Task<Client> AddClientAsync(ClientDTO clientDto)
        {
            var client = _mapper.Map<Client>(clientDto);
            return await _clientRepository.AddAsync(client); 
        }

        public async Task<Client> UpdateClientAsync(int clientId, UpdateClientDTO updateClientDTO)
        {
            var existingClient = await _clientRepository.GetByIdAsync(clientId);

            if (existingClient == null)
                throw new ArgumentNullException(nameof(updateClientDTO));

            _mapper.Map(updateClientDTO, existingClient);

            return await _clientRepository.UpdateAsync(existingClient);
        }

        public async Task<Client> ChangePasswordAsync(int clientId, string newPassword)
        {
            var client = await _clientRepository.GetByIdAsync(clientId);
            if (client == null)
                throw new ArgumentException("Клиент не найден");

            client.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            return await _clientRepository.UpdateAsync(client);
        }

        public async Task<Client> GetClientWithRelationsAsync(int id)
        {
            // Здесь нужно использовать Include для загрузки связанных данных
            return await _clientRepository.GetByIdWithRelationsAsync(id);
        }

        public async Task<bool> DeleteClientAsync(int id)
        {
            return await _clientRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsClientAsync(int id)
        {
            return await _clientRepository.ExistAsync(id);
        }

        public async Task<Client> GetMyProfile(int id)
        {
            return await GetClientByIdAsync(id);
        }
    }
}

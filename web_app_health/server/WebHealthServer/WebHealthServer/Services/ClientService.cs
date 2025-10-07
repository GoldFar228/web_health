using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class ClientService
    {
        private readonly ClientRepository _clientRepository;
        private readonly IMapper _mapper;

        public ClientService(ClientRepository clientRepository, IMapper mapper)
        {
            _clientRepository = clientRepository;
            _mapper = mapper;
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

        public async Task<Client> AddClientAsync(Client client)
        {
            return await _clientRepository.AddAsync(client); 
        }

        public async Task<Client> UpdateClientAsync(Client client)
        {
            if(client == null)
                throw new ArgumentNullException(nameof(client));

            return await _clientRepository.UpdateAsync(client);
        }

        public async Task<bool> DeleteClientAsync(int id)
        {
            return await _clientRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsClientAsync(int id)
        {
            return await _clientRepository.ExistAsync(id);
        }
    }
}

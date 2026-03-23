using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IPersonalFoodService
    {
        Task<IEnumerable<PersonalFoodDto>> SearchPersonalFoodsAsync(int clientId, string query, CancellationToken ct = default);
        Task<PersonalFoodDto> AddPersonalFoodAsync(int clientId, CreatePersonalFoodDto dto, CancellationToken ct = default);
        Task<PersonalFoodDto?> GetPersonalFoodAsync(int clientId, int foodId, CancellationToken ct = default);
        Task<bool> DeletePersonalFoodAsync(int clientId, int foodId, CancellationToken ct = default);
    }
}

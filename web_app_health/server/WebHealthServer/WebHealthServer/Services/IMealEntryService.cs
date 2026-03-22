using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IMealEntryService
    {
        Task<MealEntryResponseDto> AddEntryAsync(int clientId, CreateMealEntryDto dto, CancellationToken ct = default);
        Task<IEnumerable<MealEntryResponseDto>> GetEntriesByDateAsync(int clientId, DateOnly date, CancellationToken ct = default);
        Task<IEnumerable<MealEntryResponseDto>> GetEntriesByRangeAsync(int clientId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
        Task<DailySummaryDto> GetDailySummaryAsync(int clientId, DateOnly date, CancellationToken ct = default);
        Task<MealEntryResponseDto?> UpdateEntryAsync(int clientId, int entryId, CreateMealEntryDto dto, CancellationToken ct = default);
        Task<bool> DeleteEntryAsync(int clientId, int entryId, CancellationToken ct = default);
    }
}

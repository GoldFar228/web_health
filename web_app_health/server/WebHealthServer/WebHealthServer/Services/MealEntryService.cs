using AutoMapper;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class MealEntryService
    {
        private readonly MealEntryRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<MealEntryService> _logger;

        public MealEntryService(
            MealEntryRepository repository,
            IMapper mapper,
            ILogger<MealEntryService> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        // Базовые CRUD операции (уже есть в AbstractRepository)
        public async Task<MealEntry> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<MealEntry>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<MealEntry> CreateAsync(MealEntry entity)
        {
            return await _repository.AddAsync(entity);
        }

        public async Task<MealEntry> UpdateAsync(MealEntry entity)
        {
            return await _repository.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        // Специфичные методы для MealEntry
        public async Task<IEnumerable<MealEntry>> GetByClientAndDateAsync(int clientId, DateOnly date)
        {
            return await _repository.GetByClientAndDateAsync(clientId, date);
        }

        public async Task<DailySummaryDto> GetDailySummaryAsync(int clientId, DateOnly date)
        {
            var entries = await _repository.GetByClientAndDateAsync(clientId, date);
            var (calories, protein, carbs, fat, count) =
                await _repository.GetDailyTotalsAsync(clientId, date);

            return new DailySummaryDto
            {
                Date = date,
                TotalCalories = calories,
                TotalProtein = protein,
                TotalCarbohydrates = carbs,
                TotalFat = fat,
                MealCount = count,
                Meals = _mapper.Map<List<MealEntryResponseDto>>(entries)
            };
        }

        // Метод для создания из DTO
        public async Task<MealEntry> CreateFromDtoAsync(int clientId, CreateMealEntryDto dto)
        {
            var mealEntry = _mapper.Map<MealEntry>(dto);
            mealEntry.ClientId = clientId;
            // SetDateFields() не вызываем!
            return await _repository.AddAsync(mealEntry);
        }
    }
}

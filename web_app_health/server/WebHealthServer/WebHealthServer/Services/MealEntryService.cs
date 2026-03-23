using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebHealthServer.Data;
using WebHealthServer.Models;
using WebHealthServer.Services;

public class MealEntryService : IMealEntryService
{
    private readonly AppDbContext _context;
    private readonly FatSecretService? _fatSecretService;
    private readonly IMapper _mapper; // 🔥 Добавляем IMapper
    private readonly ILogger<MealEntryService> _logger;

    public MealEntryService(
        AppDbContext context,
        FatSecretService? fatSecretService,
        IMapper mapper, // 🔥 Инжектим через DI
        ILogger<MealEntryService> logger)
    {
        _context = context;
        _fatSecretService = fatSecretService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<MealEntryResponseDto> AddEntryAsync(int clientId, CreateMealEntryDto dto, CancellationToken ct = default)
    {
        // 🔥 Логика подтягивания нутриентов из FatSecret (остаётся ручной)
        if (!string.IsNullOrEmpty(dto.FatSecretFoodId) &&
    (!dto.Calories.HasValue || !dto.Protein.HasValue || !dto.Carbohydrates.HasValue || !dto.Fat.HasValue))
        {
            try
            {
                var foodJson = await _fatSecretService.GetFoodDetailsAsync(dto.FatSecretFoodId, ct);

                // 🔥 Проверяем, что ответ не пустой и валидный JSON
                if (string.IsNullOrWhiteSpace(foodJson) || !foodJson.TrimStart().StartsWith("{"))
                {
                    _logger.LogWarning("Invalid response from FatSecret for {FoodId}", dto.FatSecretFoodId);
                }
                else
                {
                    if (!string.IsNullOrWhiteSpace(foodJson) && foodJson.Trim().StartsWith("{"))
                    {
                        using var doc = JsonDocument.Parse(foodJson);
                        var nutrition = doc.RootElement.GetProperty("food").GetProperty("nutrition");

                        var servingSize = nutrition.GetProperty("serving_size").GetDecimal();
                        var ratio = dto.Quantity / servingSize;

                        dto.Calories ??= nutrition.GetProperty("calories").GetDecimal() * ratio;
                        dto.Protein ??= nutrition.GetProperty("protein").GetDecimal() * ratio;
                        dto.Carbohydrates ??= nutrition.GetProperty("carbohydrate").GetDecimal() * ratio;
                        dto.Fat ??= nutrition.GetProperty("fat").GetDecimal() * ratio;
                    }
                }
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse FatSecret JSON response for {FoodId}", dto.FatSecretFoodId);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "HTTP error calling FatSecret for {FoodId}", dto.FatSecretFoodId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Unexpected error fetching FatSecret data for {FoodId}", dto.FatSecretFoodId);
            }
        }

        // Валидация
        if (string.IsNullOrEmpty(dto.FatSecretFoodId) &&
            (!dto.Calories.HasValue || !dto.Protein.HasValue || !dto.Carbohydrates.HasValue || !dto.Fat.HasValue))
        {
            throw new ArgumentException("Either FatSecretFoodId or all nutrient values must be provided");
        }

        // 🔥 Маппинг через AutoMapper вместо ручного new MealEntry { ... }
        var entry = _mapper.Map<MealEntry>(dto);

        // 🔥 Заполняем поля, которые не маппятся из DTO
        entry.ClientId = clientId;
        entry.FatSecretFoodId = dto.FatSecretFoodId;
        entry.CreatedAt = DateTime.UtcNow;

        _context.MealEntries.Add(entry);
        await _context.SaveChangesAsync(ct);

        // 🔥 Маппинг ответа через AutoMapper вместо ручного MapToResponseDto
        return _mapper.Map<MealEntryResponseDto>(entry);
    }

    public async Task<IEnumerable<MealEntryResponseDto>> GetEntriesByDateAsync(int clientId, DateOnly date, CancellationToken ct = default)
    {
        var entries = await _context.MealEntries
            .Where(e => e.ClientId == clientId && e.EntryDate == date)
            .OrderBy(e => e.EntryTime ?? TimeOnly.MinValue)
            .ToListAsync(ct);

        // 🔥 Маппинг списка одной строкой
        return _mapper.Map<IEnumerable<MealEntryResponseDto>>(entries);
    }

    public async Task<DailySummaryDto> GetDailySummaryAsync(int clientId, DateOnly date, CancellationToken ct = default)
    {
        var entries = await _context.MealEntries
            .Where(e => e.ClientId == clientId && e.EntryDate == date)
            .ToListAsync(ct);

        return new DailySummaryDto
        {
            Date = date,
            TotalCalories = entries.Sum(e => e.Calories),
            TotalProtein = entries.Sum(e => e.Protein),
            TotalCarbohydrates = entries.Sum(e => e.Carbohydrates),
            TotalFat = entries.Sum(e => e.Fat),
            MealCount = entries.Count,
            Meals = _mapper.Map<List<MealEntryResponseDto>>(entries) // 🔥 Маппинг списка
        };
    }

    public async Task<MealEntryResponseDto?> UpdateEntryAsync(int clientId, int entryId, CreateMealEntryDto dto, CancellationToken ct = default)
    {
        var entry = await _context.MealEntries
            .FirstOrDefaultAsync(e => e.Id == entryId && e.ClientId == clientId, ct);

        if (entry == null)
            return null;

        // 🔥 Обновляем только поля из DTO, игнорируя защищённые свойства
        _mapper.Map(dto, entry);

        // 🔥 Обновляем специфичные поля вручную
        entry.FatSecretFoodId = dto.FatSecretFoodId;
        entry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return _mapper.Map<MealEntryResponseDto>(entry);
    }

    public async Task<bool> DeleteEntryAsync(int clientId, int entryId, CancellationToken ct = default)
    {
        var entry = await _context.MealEntries
            .FirstOrDefaultAsync(e => e.Id == entryId && e.ClientId == clientId, ct);

        if (entry == null)
            return false;

        _context.MealEntries.Remove(entry);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IEnumerable<MealEntryResponseDto>> GetEntriesByRangeAsync(int clientId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        var entries = await _context.MealEntries
            .Where(e => e.ClientId == clientId && e.EntryDate >= startDate && e.EntryDate <= endDate)
            .OrderByDescending(e => e.EntryDate)
            .ThenBy(e => e.EntryTime ?? TimeOnly.MinValue)
            .ToListAsync(ct);

        return _mapper.Map<IEnumerable<MealEntryResponseDto>>(entries);
    }

}
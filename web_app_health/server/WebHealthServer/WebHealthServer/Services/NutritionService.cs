using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using WebHealthServer.Data;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class NutritionService : INutritionService
    {
        private readonly IFatSecretApiService _fatSecretService;
        private readonly AppDbContext _db;
        private readonly ILogger<NutritionService> _logger;

        public NutritionService(
            IFatSecretApiService fatSecretService,
            AppDbContext db,
            ILogger<NutritionService> logger)
        {
            _fatSecretService = fatSecretService;
            _db = db;
            _logger = logger;
        }

        public async Task<object> SearchFoodsAsync(string query, int limit = 10)
        {
            _logger.LogDebug("Searching foods: query={Query}, limit={Limit}", query, limit);
            return await _fatSecretService.SearchFoodsAsync(query, limit);
        }

        public async Task<MealEntry> AddToDiaryAsync(int clientId, AddToDiaryDto dto)
        {
            // 1. Если указан FatSecretFoodId — получаем данные из внешнего API
            FoodData? foodData = null;
            if (dto.FatSecretFoodId.HasValue)
            {
                var foodResponse = await _fatSecretService.GetFoodByIdAsync(dto.FatSecretFoodId.Value);
                foodData = foodResponse?.food;

                if (foodData == null)
                    _logger.LogWarning("Не удалось получить данные о продукте {FoodId} из FatSecret",
                        dto.FatSecretFoodId);
            }

            // 2. Создаём запись с пересчётом КБЖУ
            var entry = new MealEntry
            {
                ClientId = clientId,

                // Связь с внешним справочником
                FatSecretFoodId = dto.FatSecretFoodId,

                // Название и бренд (приоритет: API → ручной ввод)
                FoodName = foodData?.food_name ?? dto.FoodName ?? "Неизвестный продукт",
                Brand = foodData?.brand_name ?? dto.Brand,

                // Количество и единицы
                Quantity = dto.Quantity,
                Unit = dto.Unit ?? "g",

                // КБЖУ: либо из API (пересчитанное), либо из DTO
                Calories = foodData != null
                    ? CalculateNutrientValue(foodData.servings?.serving, dto.Quantity, dto.Unit, s => s.calories)
                    : dto.Calories ?? 0,

                Protein = foodData != null
                    ? CalculateNutrientValue(foodData.servings?.serving, dto.Quantity, dto.Unit, s => s.protein)
                    : dto.Protein ?? 0,

                Carbohydrates = foodData != null
                    ? CalculateNutrientValue(foodData.servings?.serving, dto.Quantity, dto.Unit, s => s.carbohydrate)
                    : dto.Carbohydrates ?? 0,

                Fat = foodData != null
                    ? CalculateNutrientValue(foodData.servings?.serving, dto.Quantity, dto.Unit, s => s.fat)
                    : dto.Fat ?? 0,

                // Метаданные
                MealType = dto.MealType ?? "other",
                EntryDate = dto.EntryDate,
                EntryTime = dto.EntryTime ?? TimeOnly.FromDateTime(DateTime.UtcNow),
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            // 3. Сохраняем в БД
            _db.MealEntries.Add(entry);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Добавлена запись в дневник: ClientId={ClientId}, FoodName={FoodName}",
                clientId, entry.FoodName);

            return entry;
        }

        public async Task<List<MealEntry>> GetDiaryHistoryAsync(int clientId, DateOnly? from, DateOnly? to)
        {
            from ??= DateOnly.FromDateTime(DateTime.Today);
            to ??= from.Value;

            return await _db.MealEntries
                .Where(e => e.ClientId == clientId &&
                           e.EntryDate >= from.Value &&
                           e.EntryDate <= to.Value)
                .OrderByDescending(e => e.EntryDate)
                .ThenByDescending(e => e.EntryTime)
                .ToListAsync();
        }

        public async Task<object> GetDiarySummaryAsync(int clientId, DateOnly? from, DateOnly? to)
        {
            var entries = await GetDiaryHistoryAsync(clientId, from, to);

            return entries
                .GroupBy(e => e.EntryDate)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalCalories = g.Sum(e => e.Calories),
                    TotalProtein = g.Sum(e => e.Protein),
                    TotalCarbohydrates = g.Sum(e => e.Carbohydrates),
                    TotalFat = g.Sum(e => e.Fat),
                    EntriesCount = g.Count()
                })
                .ToList();
        }

        // 🔹 Вспомогательный метод для пересчёта КБЖУ
        private decimal CalculateNutrientValue(
            List<ServingData>? servings,
            decimal userQuantity,
            string? userUnit,
            Func<ServingData, string?> nutrientSelector)
        {
            if (servings == null || servings.Count == 0)
                return 0;

            // Берём первую доступную порцию (приоритет: метрическая в граммах)
            var baseServing = servings.FirstOrDefault(s =>
                s.metric_serving_unit == "g") ?? servings[0];

            // Парсим значение нутриента
            var nutrientValue = nutrientSelector(baseServing);
            if (string.IsNullOrEmpty(nutrientValue) ||
                !decimal.TryParse(nutrientValue, out var baseValue))
                return 0;

            // Получаем базовое количество
            if (string.IsNullOrEmpty(baseServing.metric_serving_amount) ||
                !decimal.TryParse(baseServing.metric_serving_amount, out var baseAmount))
                baseAmount = 100; // дефолт: на 100г

            // Пересчитываем на нужное количество
            return Math.Round(baseValue * userQuantity / baseAmount, 2);
        }
    }
}

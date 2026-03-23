using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class PersonalFoodService : IPersonalFoodService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PersonalFoodService> _logger;

        public PersonalFoodService(AppDbContext context, ILogger<PersonalFoodService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<PersonalFoodDto>> SearchPersonalFoodsAsync(int clientId, string query, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
                return Enumerable.Empty<PersonalFoodDto>();

            var searchKey = query.ToLowerInvariant();

            var foods = await _context.PersonalFoods
                .Where(f =>
                    f.ClientId == clientId &&
                    (f.Name + " " + (f.Brand ?? "")).ToLower().Contains(searchKey))
                .OrderByDescending(f => f.UsedAt)
                .ThenBy(f => f.Name)
                .Take(10)
                .ToListAsync(ct);

            return foods.Select(f => new PersonalFoodDto
            {
                Id = f.Id,
                Name = f.Name,
                Brand = f.Brand,
                CaloriesPer100g = f.CaloriesPer100g,
                ProteinPer100g = f.ProteinPer100g,
                CarbsPer100g = f.CarbsPer100g,
                FatPer100g = f.FatPer100g,
                DefaultUnit = f.DefaultUnit
            });
        }

        public async Task<PersonalFoodDto> AddPersonalFoodAsync(int clientId, CreatePersonalFoodDto dto, CancellationToken ct = default)
        {
            // Авто-расчёт калорий, если не указаны, но есть макросы
            if (dto.CaloriesPer100g == 0 && (dto.ProteinPer100g > 0 || dto.CarbsPer100g > 0 || dto.FatPer100g > 0))
            {
                dto.CaloriesPer100g = dto.ProteinPer100g * 4 + dto.CarbsPer100g * 4 + dto.FatPer100g * 9;
            }

            var food = new PersonalFood
            {
                ClientId = clientId,
                Name = dto.Name.Trim(),
                Brand = dto.Brand?.Trim(),
                CaloriesPer100g = dto.CaloriesPer100g,
                ProteinPer100g = dto.ProteinPer100g,
                CarbsPer100g = dto.CarbsPer100g,
                FatPer100g = dto.FatPer100g,
                DefaultUnit = dto.DefaultUnit,
                CreatedAt = DateTime.UtcNow,
                UsedAt = DateTime.UtcNow
            };

            _context.PersonalFoods.Add(food);
            await _context.SaveChangesAsync(ct);

            return new PersonalFoodDto
            {
                Id = food.Id,
                Name = food.Name,
                Brand = food.Brand,
                CaloriesPer100g = food.CaloriesPer100g,
                ProteinPer100g = food.ProteinPer100g,
                CarbsPer100g = food.CarbsPer100g,
                FatPer100g = food.FatPer100g,
                DefaultUnit = food.DefaultUnit
            };
        }

        public async Task<PersonalFoodDto?> GetPersonalFoodAsync(int clientId, int foodId, CancellationToken ct = default)
        {
            var food = await _context.PersonalFoods
                .FirstOrDefaultAsync(f => f.Id == foodId && f.ClientId == clientId, ct);

            if (food == null) return null;

            // Обновляем UsedAt для сортировки
            food.UsedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);

            return new PersonalFoodDto
            {
                Id = food.Id,
                Name = food.Name,
                Brand = food.Brand,
                CaloriesPer100g = food.CaloriesPer100g,
                ProteinPer100g = food.ProteinPer100g,
                CarbsPer100g = food.CarbsPer100g,
                FatPer100g = food.FatPer100g,
                DefaultUnit = food.DefaultUnit
            };
        }

        public async Task<bool> DeletePersonalFoodAsync(int clientId, int foodId, CancellationToken ct = default)
        {
            var food = await _context.PersonalFoods
                .FirstOrDefaultAsync(f => f.Id == foodId && f.ClientId == clientId, ct);

            if (food == null) return false;

            _context.PersonalFoods.Remove(food);
            await _context.SaveChangesAsync(ct);
            return true;
        }
    }
}

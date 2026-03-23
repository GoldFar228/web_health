using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.DTOs;
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
                CaloriesPerServing = f.CaloriesPerServing,
                ProteinPerServing = f.ProteinPerServing,
                CarbsPerServing = f.CarbsPerServing,
                FatPerServing = f.FatPerServing,
                DefaultUnit = f.DefaultUnit
            });
        }

        public async Task<PersonalFoodDto> AddPersonalFoodAsync(int clientId, CreatePersonalFoodDto dto, CancellationToken ct = default)
        {
            // Авто-расчёт калорий, если не указаны, но есть макросы
            if (dto.CaloriesPerServing == 0 && (dto.ProteinPerServing > 0 || dto.CarbsPerServing > 0 || dto.FatPerServing > 0))
            {
                dto.CaloriesPerServing = (int)(dto.ProteinPerServing * 4 + dto.CarbsPerServing * 4 + dto.FatPerServing * 9);
            }

            var food = new PersonalFood
            {
                ClientId = clientId,
                Name = dto.Name.Trim(),
                Brand = dto.Brand?.Trim(),
                CaloriesPerServing = dto.CaloriesPerServing,
                ProteinPerServing = dto.ProteinPerServing,
                CarbsPerServing = dto.CarbsPerServing,
                FatPerServing = dto.FatPerServing,
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
                CaloriesPerServing = food.CaloriesPerServing,
                ProteinPerServing = food.ProteinPerServing,
                CarbsPerServing = food.CarbsPerServing,
                FatPerServing = food.FatPerServing,
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
                CaloriesPerServing = food.CaloriesPerServing,
                ProteinPerServing = food.ProteinPerServing,
                CarbsPerServing = food.CarbsPerServing,
                FatPerServing = food.FatPerServing,
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

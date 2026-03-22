using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class MealEntryRepository : FatSecretOptions<MealEntry>
    {
        public MealEntryRepository(AppDbContext context) : base(context)
        {
        }

        // Дополнительные методы для MealEntry
        public async Task<IEnumerable<MealEntry>> GetByClientAndDateAsync(int clientId, DateOnly date)
        {
            return await _context.MealEntries
                .Where(e => e.ClientId == clientId && e.EntryDate == date)
                .OrderBy(e => e.EntryTime)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<MealEntry>> GetByClientAndDateRangeAsync(
            int clientId,
            DateOnly startDate,
            DateOnly endDate)
        {
            return await _context.MealEntries
                .Where(e => e.ClientId == clientId &&
                            e.EntryDate >= startDate &&
                            e.EntryDate <= endDate)
                .OrderByDescending(e => e.EntryDate)
                .ThenBy(e => e.EntryTime)
                .AsNoTracking()
                .ToListAsync();
        }

        // Простой метод для статистики (можно и в сервисе считать)
        public async Task<(decimal Calories, decimal Protein, decimal Carbs, decimal Fat, int Count)>
            GetDailyTotalsAsync(int clientId, DateOnly date)
        {
            var entries = await GetByClientAndDateAsync(clientId, date);

            return (
                Calories: entries.Sum(e => e.Calories),
                Protein: entries.Sum(e => e.Protein),
                Carbs: entries.Sum(e => e.Carbohydrates),
                Fat: entries.Sum(e => e.Fat),
                Count: entries.Count()
            );
        }
    }
}

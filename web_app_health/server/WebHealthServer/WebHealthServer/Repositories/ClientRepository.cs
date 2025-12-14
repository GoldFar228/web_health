using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class ClientRepository : AbstractRepository<Client>
    {
        public ClientRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Client> GetByIdWithRelationsAsync(int id)
        {
            return await _context.Clients
                .Include(c => c.Coach)          // Загружаем тренера
                .Include(c => c.Diet)           // Загружаем диету
                //.Include(c => c.TrainingProgram) // Загружаем программу тренировок
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        // Проверка email на уникальность (кроме текущего клиента)
        public async Task<bool> IsEmailUniqueAsync(string email, int excludeClientId = 0)
        {
            return !await _context.Clients
                .AnyAsync(c => c.Email == email && c.Id != excludeClientId);
        }
    }
}

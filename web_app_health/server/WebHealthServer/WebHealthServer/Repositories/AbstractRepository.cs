using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class AbstractRepository<T> : IRepository<T> where T : AbstractEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public AbstractRepository(AppDbContext context)
        {
            var clients = context.Clients.ToList();
            _context = context;
            _dbSet = context.Set<T>();
        }
        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }


        public async Task<IEnumerable<T>> GetAllAsync()
        {
            var all = await _dbSet.AsNoTracking().ToListAsync();
            return all;
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Id == id); //тут был FindAsync(не находил запись из БД), стоит использовать FirstOfDefault().
        }

        public async Task<T> UpdateAsync(T entity)
        {
            var existingEntity = await _dbSet.FindAsync(entity.Id);
            if (existingEntity == null)
                throw new Exception("Сущности с таким Id не существует");

            _context.Entry(existingEntity).CurrentValues.SetValues(entity);
            //_dbSet.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
            {
                return false;
            }
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistAsync(int id)
        {
            return await _dbSet.AnyAsync(x => x.Id == id);
        }
    }
}

using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public interface IRepository<T> where T : AbstractEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistAsync(int id);
    }
}

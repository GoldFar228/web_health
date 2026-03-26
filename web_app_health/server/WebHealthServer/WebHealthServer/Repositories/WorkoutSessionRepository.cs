using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class WorkoutSessionRepository : IWorkoutSessionRepository
    {
        private readonly AppDbContext _context;

        public WorkoutSessionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WorkoutSession?> GetByIdAsync(int id)
        {
            return await _context.WorkoutSessions
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<WorkoutSession>> GetAllByClientIdAsync(int clientId)
        {
            return await _context.WorkoutSessions
                .Where(s => s.ClientId == clientId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();
        }

        public async Task<WorkoutSession> CreateAsync(WorkoutSession session)
        {
            await _context.WorkoutSessions.AddAsync(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<WorkoutSession> UpdateAsync(WorkoutSession session)
        {
            _context.WorkoutSessions.Update(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task DeleteAsync(int id)
        {
            var session = await GetByIdAsync(id);
            if (session != null)
            {
                _context.WorkoutSessions.Remove(session);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<WorkoutSession?> GetByIdWithExercisesAsync(int id)
        {
            return await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                    .ThenInclude(se => se.Exercise)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<WorkoutSession>> GetByClientIdWithExercisesAsync(int clientId)
        {
            return await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                    .ThenInclude(se => se.Exercise)
                .Where(s => s.ClientId == clientId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();
        }
        public async Task<WorkoutSessionExercise> AddExerciseToSessionAsync(WorkoutSessionExercise sessionExercise)
        {
            await _context.WorkoutSessionExercises.AddAsync(sessionExercise);
            await _context.SaveChangesAsync();
            return sessionExercise;
        }
    }
}

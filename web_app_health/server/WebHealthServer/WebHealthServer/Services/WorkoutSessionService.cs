using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class WorkoutSessionService : IWorkoutSessionService
    {
        private readonly AppDbContext _context;

        public WorkoutSessionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WorkoutSessionDto> CreateSessionAsync(int clientId, CreateWorkoutSessionDto dto)
        {
            var session = new WorkoutSession
            {
                ClientId = clientId,
                Date = dto.Date,
                DurationMinutes = dto.DurationMinutes,
                Notes = dto.Notes,
                Status = dto.Status,
                SessionExercises = new List<WorkoutSessionExercise>()
            };

            foreach (var exerciseDto in dto.Exercises)
            {
                var sessionExercise = new WorkoutSessionExercise
                {
                    ExerciseId = exerciseDto.ExerciseId,
                    Order = exerciseDto.Order,
                    Notes = exerciseDto.Notes
                };

                // ✅ Сериализуем сеты в JSON
                sessionExercise.SetSets(exerciseDto.Sets);

                session.SessionExercises.Add(sessionExercise);
            }

            _context.WorkoutSessions.Add(session);
            await _context.SaveChangesAsync();

            return MapToDto(session);
        }

        public async Task<WorkoutSessionDto?> GetSessionByIdAsync(int id)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                    .ThenInclude(se => se.Exercise)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null)
                return null;

            return MapToDto(session);
        }

        public async Task<List<WorkoutSessionDto>> GetAllSessionsByClientAsync(int clientId)
        {
            var sessions = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                    .ThenInclude(se => se.Exercise)
                .Where(s => s.ClientId == clientId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            return sessions.Select(MapToDto).ToList();
        }

        public async Task<WorkoutSessionDto> UpdateSessionAsync(int id, UpdateWorkoutSessionDto dto)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null)
                throw new Exception("Session not found");

            session.Date = dto.Date;
            session.DurationMinutes = dto.DurationMinutes;
            session.Notes = dto.Notes;
            session.Status = dto.Status;

            await _context.SaveChangesAsync();

            return MapToDto(session);
        }

        public async Task DeleteSessionAsync(int id)
        {
            var session = await _context.WorkoutSessions.FindAsync(id);
            if (session == null)
                throw new Exception("Session not found");

            _context.WorkoutSessions.Remove(session);
            await _context.SaveChangesAsync();
        }

        // ✅ Helper для маппинга
        private WorkoutSessionDto MapToDto(WorkoutSession session)
        {
            return new WorkoutSessionDto
            {
                Id = session.Id,
                ClientId = session.ClientId,
                Date = session.Date,
                DurationMinutes = session.DurationMinutes,
                Notes = session.Notes,
                Status = session.Status,
                Exercises = session.SessionExercises
                    .OrderBy(se => se.Order)
                    .Select(se => new WorkoutSessionExerciseDto
                    {
                        Id = se.Id,
                        ExerciseId = se.ExerciseId,
                        ExerciseName = se.Exercise?.Name ?? "Unknown",
                        MuscleGroup = se.Exercise?.MuscleGroup,
                        Sets = se.GetSets(),
                        CompletedSets = se.CompletedSets,
                        TotalReps = se.TotalReps,
                        TotalTonnage = se.TotalTonnage,
                        Order = se.Order,
                        Notes = se.Notes
                    }).ToList()
            };
        }
        public async Task<WorkoutSessionDto> UpdateExerciseInSessionAsync(
    int sessionId,
    int exerciseId,
    UpdateSessionExerciseDto dto)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new Exception("Session not found");

            var sessionExercise = session.SessionExercises
                .FirstOrDefault(se => se.ExerciseId == exerciseId);

            if (sessionExercise == null)
                throw new Exception("Exercise not found in session");

            // ✅ Обновляем сеты и пересчитываем агрегаты
            sessionExercise.SetSets(dto.Sets);
            sessionExercise.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return MapToDto(session);
        }

        public async Task AddExerciseToSessionAsync(
            int sessionId,
            CreateWorkoutSessionExerciseDto dto)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new Exception("Session not found");

            var sessionExercise = new WorkoutSessionExercise
            {
                WorkoutSessionId = sessionId,
                ExerciseId = dto.ExerciseId,
                Order = dto.Order,
                Notes = dto.Notes
            };

            // ✅ Сериализуем сеты в JSON
            sessionExercise.SetSets(dto.Sets);

            session.SessionExercises.Add(sessionExercise);

            await _context.SaveChangesAsync();
        }

        public async Task RemoveExerciseFromSessionAsync(int sessionId, int exerciseId)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new Exception("Session not found");

            var sessionExercise = session.SessionExercises
                .FirstOrDefault(se => se.ExerciseId == exerciseId);

            if (sessionExercise == null)
                throw new Exception("Exercise not found in session");

            session.SessionExercises.Remove(sessionExercise);

            await _context.SaveChangesAsync();
        }
        public async Task<WorkoutSessionDto> UpdateSessionExercisesAsync(int sessionId, List<UpdateWorkoutSessionExerciseDto> exercisesDto)
        {
            var session = await _context.WorkoutSessions
                .Include(s => s.SessionExercises)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
                throw new Exception("Session not found");

            // ✅ Удаляем старые упражнения
            _context.WorkoutSessionExercises.RemoveRange(session.SessionExercises);

            // ✅ Добавляем новые
            session.SessionExercises = new List<WorkoutSessionExercise>();

            foreach (var exerciseDto in exercisesDto)
            {
                var sessionExercise = new WorkoutSessionExercise
                {
                    WorkoutSessionId = sessionId,
                    ExerciseId = exerciseDto.ExerciseId,
                    Order = exerciseDto.Order,
                    Notes = exerciseDto.Notes
                };

                // ✅ Сериализуем сеты в JSON
                sessionExercise.SetSets(exerciseDto.Sets);

                session.SessionExercises.Add(sessionExercise);
            }

            await _context.SaveChangesAsync();

            return MapToDto(session);
        }
    }
}

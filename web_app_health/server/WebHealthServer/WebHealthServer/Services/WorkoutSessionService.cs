using AutoMapper;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class WorkoutSessionService : IWorkoutSessionService
    {
        private readonly IWorkoutSessionRepository _repository;

        public WorkoutSessionService(IWorkoutSessionRepository repository)
        {
            _repository = repository;
        }

        public async Task<WorkoutSessionDto> CreateSessionAsync(int clientId, CreateWorkoutSessionDto dto)
        {
            var session = new WorkoutSession
            {
                ClientId = clientId,
                Date = dto.Date,
                DurationMinutes = dto.DurationMinutes,
                Notes = dto.Notes ?? string.Empty,
                Status = dto.Status,
                SessionExercises = dto.Exercises?.Select((e, index) => new WorkoutSessionExercise
                {
                    ExerciseId = e.ExerciseId,
                    ActualSets = e.ActualSets,
                    ActualReps = e.ActualReps,
                    ActualWeightKg = e.ActualWeightKg,
                    Order = index,
                    Notes = e.Notes ?? string.Empty
                }).ToList() ?? new List<WorkoutSessionExercise>()
            };

            var createdSession = await _repository.CreateAsync(session);
            return await MapToDtoAsync(createdSession);
        }

        public async Task<WorkoutSessionDto?> GetSessionByIdAsync(int id)
        {
            var session = await _repository.GetByIdWithExercisesAsync(id);
            return session != null ? await MapToDtoAsync(session) : null;
        }

        public async Task<List<WorkoutSessionDto>> GetAllSessionsByClientAsync(int clientId)
        {
            var sessions = await _repository.GetByClientIdWithExercisesAsync(clientId);
            return (await Task.WhenAll(sessions.Select(s => MapToDtoAsync(s)))).ToList();
        }

        public async Task<WorkoutSessionDto> UpdateSessionAsync(int id, UpdateWorkoutSessionDto dto)
        {
            var session = await _repository.GetByIdAsync(id);
            if (session == null)
                throw new Exception($"Workout session with id {id} not found");

            session.Date = dto.Date;
            session.DurationMinutes = dto.DurationMinutes;
            session.Notes = dto.Notes;
            session.Status = dto.Status;

            var updatedSession = await _repository.UpdateAsync(session);
            return await MapToDtoAsync(updatedSession);
        }

        public async Task DeleteSessionAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<WorkoutSessionDto> UpdateExerciseInSessionAsync(int sessionId, int exerciseId, UpdateSessionExerciseDto dto)
        {
            var session = await _repository.GetByIdWithExercisesAsync(sessionId);
            if (session == null)
                throw new Exception($"Workout session with id {sessionId} not found");

            var sessionExercise = session.SessionExercises
                .FirstOrDefault(se => se.ExerciseId == exerciseId);

            if (sessionExercise == null)
                throw new Exception($"Exercise with id {exerciseId} not found in session");

            sessionExercise.ActualSets = dto.ActualSets;
            sessionExercise.ActualReps = dto.ActualReps;
            sessionExercise.ActualWeightKg = dto.ActualWeightKg;
            sessionExercise.Notes = dto.Notes;

            await _repository.UpdateAsync(session);
            return await MapToDtoAsync(session);
        }

        public async Task AddExerciseToSessionAsync(int sessionId, CreateWorkoutSessionExerciseDto dto)
        {
            var session = await _repository.GetByIdAsync(sessionId);
            if (session == null)
                throw new Exception($"Workout session with id {sessionId} not found");

            var sessionExercise = new WorkoutSessionExercise
            {
                WorkoutSessionId = sessionId,
                ExerciseId = dto.ExerciseId,
                ActualSets = dto.ActualSets,
                ActualReps = dto.ActualReps,
                ActualWeightKg = dto.ActualWeightKg,
                Order = session.SessionExercises.Count,
                Notes = dto.Notes
            };

            await _repository.AddExerciseToSessionAsync(sessionExercise);
        }

        public async Task RemoveExerciseFromSessionAsync(int sessionId, int exerciseId)
        {
            var session = await _repository.GetByIdWithExercisesAsync(sessionId);
            if (session == null)
                throw new Exception($"Workout session with id {sessionId} not found");

            var sessionExercise = session.SessionExercises
                .FirstOrDefault(se => se.ExerciseId == exerciseId);

            if (sessionExercise != null)
            {
                session.SessionExercises.Remove(sessionExercise);
                await _repository.UpdateAsync(session);
            }
        }

        private async Task<WorkoutSessionDto> MapToDtoAsync(WorkoutSession session)
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
                        WorkoutSessionId = se.WorkoutSessionId,
                        ExerciseId = se.ExerciseId,
                        ExerciseName = se.Exercise?.Name,
                        MuscleGroup = se.Exercise?.MuscleGroup,
                        ActualSets = se.ActualSets,
                        ActualReps = se.ActualReps,
                        ActualWeightKg = se.ActualWeightKg,
                        Order = se.Order,
                        Notes = se.Notes
                    }).ToList()
            };
        }
    }
}

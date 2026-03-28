using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace WebHealthServer.Models
{
    public class WorkoutSessionExercise : AbstractEntity
    {
        public int WorkoutSessionId { get; set; }

        [ForeignKey(nameof(WorkoutSessionId))]
        public WorkoutSession WorkoutSession { get; set; }

        public int ExerciseId { get; set; }

        [ForeignKey(nameof(ExerciseId))]
        public Exercise Exercise { get; set; }

        // ✅ JSON с деталями сетов (PostgreSQL JSONB)
        [Column(TypeName = "jsonb")]
        public string SetsJson { get; set; } = "[]";

        // ✅ Агрегатные поля для быстрых запросов
        public int CompletedSets { get; set; }
        public int TotalReps { get; set; }
        public decimal TotalTonnage { get; set; }  // ✅ кг × повторения

        public int Order { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;

        // ✅ Helper методы для работы с JSON
        public List<WorkoutSetDto> GetSets()
        {
            if (string.IsNullOrEmpty(SetsJson))
                return new List<WorkoutSetDto>();

            return JsonSerializer.Deserialize<List<WorkoutSetDto>>(SetsJson)
                ?? new List<WorkoutSetDto>();
        }

        public void SetSets(List<WorkoutSetDto> sets)
        {
            SetsJson = JsonSerializer.Serialize(sets);
            RecalculateAggregates(sets);
        }

        private void RecalculateAggregates(List<WorkoutSetDto> sets)
        {
            var completedSets = sets.Where(s => s.Completed).ToList();

            CompletedSets = completedSets.Count;
            TotalReps = completedSets.Sum(s => s.Reps);
            TotalTonnage = completedSets.Sum(s => s.Reps * s.WeightKg);
        }
    }
}

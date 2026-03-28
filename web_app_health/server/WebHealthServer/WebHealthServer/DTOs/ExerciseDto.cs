using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebHealthServer.Models;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.DTOs
{
    public class ExerciseDto
    {
        public int Id { get; set; }
        public int? WgerExerciseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? MuscleGroup { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CreateExerciseDto
    {
        public int? WgerExerciseId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? MuscleGroup { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateExerciseDto
    {
        public int? WgerExerciseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? MuscleGroup { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class BatchExerciseResult
    {
        public int TotalProcessed { get; set; }
        public int Added { get; set; }
        public int Skipped { get; set; }
        public List<Exercise> Exercises { get; set; } = new();
    }
}

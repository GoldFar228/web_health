using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _service;
        private readonly ILogger<ExerciseController> _logger;

        public ExerciseController(IExerciseService service, ILogger<ExerciseController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Получить все упражнения
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ExerciseDto>>> GetExercises()
        {
            try
            {
                var exercises = await _service.GetExercisesAsync();
                var dtos = exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    WgerExerciseId = e.WgerExerciseId,
                    Name = e.Name,
                    Description = e.Description,
                    Category = e.Category,
                    MuscleGroup = e.MuscleGroup,
                    ImageUrl = e.ImageUrl
                }).ToList();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка получения упражнений");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить упражнение по ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ExerciseDto>> GetExerciseById(int id)
        {
            try
            {
                var exercise = await _service.GetExerciseByIdAsync(id);
                if (exercise == null)
                    return NotFound($"Упражнение с ID {id} не найдено");

                return Ok(new ExerciseDto
                {
                    Id = exercise.Id,
                    WgerExerciseId = exercise.WgerExerciseId,
                    Name = exercise.Name,
                    Description = exercise.Description,
                    Category = exercise.Category,
                    MuscleGroup = exercise.MuscleGroup,
                    ImageUrl = exercise.ImageUrl
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка получения упражнения {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Поиск упражнений по названию
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<List<ExerciseDto>>> SearchExercises([FromQuery] string term)
        {
            try
            {
                var exercises = await _service.SearchByNameAsync(term);
                return Ok(exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Category = e.Category,
                    MuscleGroup = e.MuscleGroup
                }).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка поиска упражнений");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить упражнения по категории
        /// </summary>
        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<ExerciseDto>>> GetByCategory(string category)
        {
            try
            {
                var exercises = await _service.GetByCategoryAsync(category);
                return Ok(exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Category = e.Category,
                    MuscleGroup = e.MuscleGroup
                }).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка получения упражнений по категории");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить упражнения по мышечной группе
        /// </summary>
        [HttpGet("muscle/{muscleGroup}")]
        public async Task<ActionResult<List<ExerciseDto>>> GetByMuscleGroup(string muscleGroup)
        {
            try
            {
                var exercises = await _service.GetByMuscleGroupAsync(muscleGroup);
                return Ok(exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Category = e.Category,
                    MuscleGroup = e.MuscleGroup
                }).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка получения упражнений по мышечной группе");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Добавить одно упражнение
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ExerciseDto>> AddExercise([FromBody] CreateExerciseDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Название упражнения обязательно");

            try
            {
                var exercise = await _service.AddExerciseAsync(dto);
                return CreatedAtAction(nameof(GetExerciseById), new { id = exercise.Id }, new ExerciseDto
                {
                    Id = exercise.Id,
                    WgerExerciseId = exercise.WgerExerciseId,
                    Name = exercise.Name,
                    Description = exercise.Description,
                    Category = exercise.Category,
                    MuscleGroup = exercise.MuscleGroup,
                    ImageUrl = exercise.ImageUrl
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка добавления упражнения");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Добавить несколько упражнений сразу (batch)
        /// </summary>
        [HttpPost("batch")]
        public async Task<ActionResult<BatchExerciseResult>> AddExercisesBatch([FromBody] List<CreateExerciseDto> dtos)
        {
            if (dtos == null || dtos.Count == 0)
                return BadRequest("Список упражнений не может быть пустым");

            try
            {
                var result = await _service.AddExercisesBatchAsync(dtos);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка пакетного добавления упражнений");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить упражнение
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ExerciseDto>> UpdateExercise(int id, [FromBody] UpdateExerciseDto dto)
        {
            if (dto == null)
                return BadRequest("Данные не могут быть пустыми");

            try
            {
                var exercise = await _service.UpdateExerciseAsync(id, dto);
                if (exercise == null)
                    return NotFound($"Упражнение с ID {id} не найдено");

                return Ok(new ExerciseDto
                {
                    Id = exercise.Id,
                    WgerExerciseId = exercise.WgerExerciseId,
                    Name = exercise.Name,
                    Description = exercise.Description,
                    Category = exercise.Category,
                    MuscleGroup = exercise.MuscleGroup,
                    ImageUrl = exercise.ImageUrl
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка обновления упражнения {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить упражнение
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteExercise(int id)
        {
            try
            {
                var exists = await _service.ExistsExerciseAsync(id);
                if (!exists)
                    return NotFound($"Упражнение с ID {id} не найдено");

                var result = await _service.DeleteExerciseAsync(id);
                if (!result)
                    return BadRequest("Не удалось удалить упражнение");

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка удаления упражнения {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}

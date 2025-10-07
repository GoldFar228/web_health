using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ExerciseController : ControllerBase
    {
        private readonly ExerciseService _service;
        private readonly ILogger<ExerciseController> _logger;

        public ExerciseController(ExerciseService service, ILogger<ExerciseController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetExercises()
        {
            try
            {
                var exercises = await _service.GetExercisesAsync();
                return Ok(exercises);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка клиентов");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }

        [HttpGet("")]
        public async Task<ActionResult<Exercise>> GetExerciseById([FromQuery] int id)
        {
            try
            {
                var exercise = await _service.GetExerciseByIdAsync(id);
                return Ok(exercise);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка клиентов");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Exercise>> AddExercise([FromBody] Exercise exercise)
        {
            if (exercise == null)
            {
                return BadRequest("Данные клиента не могут быть пустыми");
            }
            var createExercise = await _service.AddExerciseAsync(exercise);
            return Ok(createExercise);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Exercise>> UpdateExercise(int id, [FromBody] Exercise exercise)
        {
            if (exercise == null)
            {
                return BadRequest("Данные клиента не могут быть пустыми");
            }
            if (id != exercise.Id)
            {
                return BadRequest("ID в пути не совпадает с ID в теле запроса");
            }
            var updatedExercise = await _service.UpdateExerciseAsync(exercise);
            return Ok(updatedExercise);
        }
        [HttpDelete]
        public async Task<ActionResult<Exercise>> DeleteExercise(int id)
        {
            var exists = await _service.ExistsExerciseAsync(id);
            if (!exists)
                return NotFound($"Клиент с ID {id} не найден");

            var result = await _service.DeleteExerciseAsync(id);

            if (!result) 
                return BadRequest("Не удалось удалить клиента");

            return Ok(result);
        }
    }
}

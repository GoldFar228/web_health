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
                _logger.LogError(ex, "������ ��� ��������� ������ ��������");
                return StatusCode(500, "��������� ���������� ������ �������");
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
                _logger.LogError(ex, "������ ��� ��������� ������ ��������");
                return StatusCode(500, "��������� ���������� ������ �������");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Exercise>> AddExercise([FromBody] Exercise exercise)
        {
            if (exercise == null)
            {
                return BadRequest("������ ������� �� ����� ���� �������");
            }
            var createExercise = await _service.AddExerciseAsync(exercise);
            return Ok(createExercise);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Exercise>> UpdateExercise(int id, [FromBody] Exercise exercise)
        {
            if (exercise == null)
            {
                return BadRequest("������ ������� �� ����� ���� �������");
            }
            if (id != exercise.Id)
            {
                return BadRequest("ID � ���� �� ��������� � ID � ���� �������");
            }
            var updatedExercise = await _service.UpdateExerciseAsync(exercise);
            return Ok(updatedExercise);
        }
        [HttpDelete]
        public async Task<ActionResult<Exercise>> DeleteExercise(int id)
        {
            var exists = await _service.ExistsExerciseAsync(id);
            if (!exists)
                return NotFound($"������ � ID {id} �� ������");

            var result = await _service.DeleteExerciseAsync(id);

            if (!result) 
                return BadRequest("�� ������� ������� �������");

            return Ok(result);
        }
    }
}

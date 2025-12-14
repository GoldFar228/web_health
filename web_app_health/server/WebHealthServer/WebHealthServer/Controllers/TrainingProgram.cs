using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TrainingProgramController : ControllerBase
    {
        private readonly TrainingProgramService _service;
        private readonly ILogger<TrainingProgramController> _logger;

        public TrainingProgramController(TrainingProgramService service, ILogger<TrainingProgramController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainingProgram>>> GetTrainingPrograms()
        {
            try
            {
                var trainingPrograms = await _service.GetTrainingProgramsAsync();
                return Ok(trainingPrograms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка программ");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }

        [HttpGet("")]
        public async Task<ActionResult<TrainingProgram>> GetTrainingProgramById([FromQuery] int id)
        {
            try
            {
                var trainingProgram = await _service.GetTrainingProgramByIdAsync(id);
                return Ok(trainingProgram);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка программ");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TrainingProgram>> AddTrainingProgram([FromBody] TrainingProgram trainingProgram)
        {
            if (trainingProgram == null)
            {
                return BadRequest("Данные программы не могут быть пустыми");
            }
            var createTrainingProgram = await _service.AddTrainingProgramAsync(trainingProgram);
            return Ok(createTrainingProgram);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<TrainingProgram>> UpdateTrainingProgram(int id, [FromBody] TrainingProgram trainingProgram)
        {
            if (trainingProgram == null)
            {
                return BadRequest("Данные программы не могут быть пустыми");
            }
            if (id != trainingProgram.Id)
            {
                return BadRequest("ID в пути не совпадает с ID в теле запроса");
            }
            var updatedTrainingProgram = await _service.UpdateTrainingProgramAsync(trainingProgram);
            return Ok(updatedTrainingProgram);
        }
        [HttpDelete]
        public async Task<ActionResult<TrainingProgram>> DeleteTrainingProgram(int id)
        {
            var exists = await _service.ExistsTrainingProgramAsync(id);
            if (!exists)
                return NotFound($"программа с ID {id} не найден");

            var result = await _service.DeleteTrainingProgramAsync(id);

            if (!result) 
                return BadRequest("Не удалось удалить программу");

            return Ok(result);
        }
    }
}

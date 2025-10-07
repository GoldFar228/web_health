using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CoachController : ControllerBase
    {
        private readonly CoachService _service;
        private readonly ILogger<CoachController> _logger;

        public CoachController(CoachService service, ILogger<CoachController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Coach>>> GetCoachs()
        {
            try
            {
                var clients = await _service.GetCoachsAsync();
                return Ok(clients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка клиентов");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }

        [HttpGet("")]
        public async Task<ActionResult<Coach>> GetCoachById([FromQuery] int id)
        {
            try
            {
                var client = await _service.GetCoachByIdAsync(id);
                return Ok(client);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка клиентов");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Coach>> AddCoach([FromBody] Coach client)
        {
            if (client == null)
            {
                return BadRequest("Данные клиента не могут быть пустыми");
            }
            var createCoach = await _service.AddCoachAsync(client);
            return Ok(createCoach);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Coach>> UpdateCoach(int id, [FromBody] Coach client)
        {
            if (client == null)
            {
                return BadRequest("Данные клиента не могут быть пустыми");
            }
            if (id != client.Id)
            {
                return BadRequest("ID в пути не совпадает с ID в теле запроса");
            }
            var updatedCoach = await _service.UpdateCoachAsync(client);
            return Ok(updatedCoach);
        }
        [HttpDelete]
        public async Task<ActionResult<Coach>> DeleteCoach(int id)
        {
            var exists = await _service.ExistsCoachAsync(id);
            if (!exists)
                return NotFound($"Клиент с ID {id} не найден");

            var result = await _service.DeleteCoachAsync(id);

            if (!result) 
                return BadRequest("Не удалось удалить клиента");

            return Ok(result);
        }
    }
}

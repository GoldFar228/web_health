using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ClientController : ControllerBase
    {
        private readonly ClientService _service;
        private readonly ILogger<ClientController> _logger;

        public ClientController(ClientService service, ILogger<ClientController> logger)
        {
            _service = service;
            _logger = logger;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            try
            {
                var clients = await _service.GetClientsAsync();
                return Ok(clients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка клиентов");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }


        [HttpGet("")]
        public async Task<ActionResult<Client>> GetClientById([FromQuery] int id)
        {
            try
            {
                var client = await _service.GetClientByIdAsync(id);
                return Ok(client);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка клиентов");
                return StatusCode(500, "Произошла внутренняя ошибка сервера");
            }
        }


        [HttpPost]
        public async Task<ActionResult<Client>> AddClient([FromBody] ClientDTO client)
        {
            if (client == null)
            {
                return BadRequest("Данные клиента не могут быть пустыми");
            }
            var createClient = await _service.AddClientAsync(client);
            return Ok(createClient);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<Client>> UpdateClient(int id, [FromBody] UpdateClientDTO client)
        {
            //if (client == null)
            //{
            //    return BadRequest("Данные клиента не могут быть пустыми");
            //}
            //if (id != client.Id)
            //{
            //    return BadRequest("ID в пути не совпадает с ID в теле запроса");
            //}
            //var updatedClient = await _service.UpdateClientAsync(client);
            //return Ok(updatedClient);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedClient = await _service.UpdateClientAsync(id, client);

                return Ok(new
                {
                    message = "Всё гуд"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении клиента {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }


        [HttpPatch("{id}/password")]
        public async Task<ActionResult> ChangePassword(int id, [FromBody] UpdatePasswordDTO passwordDTO)
        {
            try
            {
                await _service.ChangePasswordAsync(id, passwordDTO.NewPassword);
                return Ok(new { message = "Пароль успешно изменен" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при смене пароля клиента {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }


        [HttpGet("{id}/with-relations")]
        public async Task<ActionResult<Client>> GetClientWithRelations(int id)
        {
            try
            {
                var client = await _service.GetClientWithRelationsAsync(id);
                if (client == null)
                    return NotFound();

                return Ok(client);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении клиента {Id} со связями", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }


        [HttpDelete]
        public async Task<ActionResult<Client>> DeleteClient(int id)
        {
            var exists = await _service.ExistsClientAsync(id);
            if (!exists)
                return NotFound($"Клиент с ID {id} не найден");

            var result = await _service.DeleteClientAsync(id);

            if (!result) 
                return BadRequest("Не удалось удалить клиента");

            return Ok(result);
        }
    }
}

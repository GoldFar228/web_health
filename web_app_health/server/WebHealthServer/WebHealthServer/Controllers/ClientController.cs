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
                _logger.LogError(ex, "������ ��� ��������� ������ ��������");
                return StatusCode(500, "��������� ���������� ������ �������");
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
                _logger.LogError(ex, "������ ��� ��������� ������ ��������");
                return StatusCode(500, "��������� ���������� ������ �������");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Client>> AddClient([FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest("������ ������� �� ����� ���� �������");
            }
            var createClient = await _service.AddClientAsync(client);
            return Ok(createClient);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<Client>> UpdateClient(int id, [FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest("������ ������� �� ����� ���� �������");
            }
            if (id != client.Id)
            {
                return BadRequest("ID � ���� �� ��������� � ID � ���� �������");
            }
            var updatedClient = await _service.UpdateClientAsync(client);
            return Ok(updatedClient);
        }
        [HttpDelete]
        public async Task<ActionResult<Client>> DeleteClient(int id)
        {
            var exists = await _service.ExistsClientAsync(id);
            if (!exists)
                return NotFound($"������ � ID {id} �� ������");

            var result = await _service.DeleteClientAsync(id);

            if (!result) 
                return BadRequest("�� ������� ������� �������");

            return Ok(result);
        }
    }
}

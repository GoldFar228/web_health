using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebHealthServer.Hubs;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;
        private readonly ILogger<ClientController> _logger;

        public AuthController(AuthService service)
        {
            _service = service;
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var token = await _service.LoginAsync(login);
            if (token == null) 
                return Unauthorized("Invalid credentials");
            return Ok(token);
            

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] ClientDTO register)
        {
            var success = await _service.RegisterAsync(register);
            if (success.ErrorMessage != null) return BadRequest(success.ErrorMessage);

            return Ok(success);
        }
    }
}

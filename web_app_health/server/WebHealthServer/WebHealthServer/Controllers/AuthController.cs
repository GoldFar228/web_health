using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
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
            // TODO: Заменить на реальную проверку из базы данных
            //if (login.Email.Contains("admin") && login.Password == "admin")
            //{
            //    var user = new AuthUser
            //    {
            //        Id = 1,
            //        Email = "admin@example.com"
            //    };

            //    var token = _service.GenerateToken(user);

            //    return Ok(new AuthResponse
            //    {
            //        Token = token,
            //        Username = user.Username,
            //        Expires = DateTime.Now.AddMinutes(60)
            //    });
            //}

            //return Unauthorized("Invalid credentials");

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

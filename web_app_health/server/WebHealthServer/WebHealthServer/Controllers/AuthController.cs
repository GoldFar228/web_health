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
        private readonly JwtService _service;
        private readonly ILogger<ClientController> _logger;

        public AuthController(JwtService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            // TODO: Заменить на реальную проверку из базы данных
            if (login.Email.Contains("admin") && login.Password == "admin")
            {
                var user = new AuthUser
                {
                    Id = 1,
                    Email = "admin@example.com"
                };

                var token = _service.GenerateToken(user);

                return Ok(new AuthResponse
                {
                    Token = token,
                    Username = user.Username,
                    Expires = DateTime.Now.AddMinutes(60)
                });
            }

            return Unauthorized("Invalid credentials");
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest register)
        {

        }

    }
}

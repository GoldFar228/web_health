using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class WorkoutSessionController : ControllerBase
    {
        private readonly IWorkoutSessionService _service;

        public WorkoutSessionController(IWorkoutSessionService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateWorkoutSessionDto dto)
        {
            try
            {
                // Получаем clientId из токена (через Claims)
                var clientId = GetClientIdFromClaims();
                var result = await _service.CreateSessionAsync(clientId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _service.GetSessionByIdAsync(id);
                if (result == null)
                    return NotFound(new { message = "Workout session not found" });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllByClient()
        {
            try
            {
                var clientId = GetClientIdFromClaims();
                var result = await _service.GetAllSessionsByClientAsync(clientId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkoutSessionDto dto)
        {
            try
            {
                var result = await _service.UpdateSessionAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteSessionAsync(id);
                return Ok(new { message = "Workout session deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{sessionId}/exercise/{exerciseId}")]
        public async Task<IActionResult> UpdateExercise(int sessionId, int exerciseId, [FromBody] UpdateSessionExerciseDto dto)
        {
            try
            {
                var result = await _service.UpdateExerciseInSessionAsync(sessionId, exerciseId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{sessionId}/exercise")]
        public async Task<IActionResult> AddExercise(int sessionId, [FromBody] CreateWorkoutSessionExerciseDto dto)
        {
            try
            {
                await _service.AddExerciseToSessionAsync(sessionId, dto);
                return Ok(new { message = "Exercise added to session" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{sessionId}/exercise/{exerciseId}")]
        public async Task<IActionResult> RemoveExercise(int sessionId, int exerciseId)
        {
            try
            {
                await _service.RemoveExerciseFromSessionAsync(sessionId, exerciseId);
                return Ok(new { message = "Exercise removed from session" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private int GetClientIdFromClaims()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                throw new Exception("Client ID not found in token claims");
            return int.Parse(claim.Value);
        }


        [HttpPut("{id}/exercises")]
        public async Task<IActionResult> UpdateExercises(int id, [FromBody] List<UpdateWorkoutSessionExerciseDto> dto)
        {
            try
            {
                var result = await _service.UpdateSessionExercisesAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

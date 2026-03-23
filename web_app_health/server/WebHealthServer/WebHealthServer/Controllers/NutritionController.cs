using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using WebHealthServer.Data;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class NutritionController : ControllerBase
    {
        private readonly FatSecretService _fatSecretService;
        private readonly ILogger<NutritionController> _logger;

        public NutritionController(
            FatSecretService fatSecretService,
            ILogger<NutritionController> logger)
        {
            _fatSecretService = fatSecretService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchFoods(
            [FromQuery] string query,
            [FromQuery] int limit = 10,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query parameter is required");

            try
            {
                var result = await _fatSecretService.SearchFoodsAsync(query, limit, ct);
                return Content(result, "application/json");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error searching foods");
                return StatusCode(502, new { error = "Failed to fetch data from FatSecret" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("food/{foodId}")]
        public async Task<IActionResult> GetFoodDetails(
            string foodId,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _fatSecretService.GetFoodDetailsAsync(foodId, ct);
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting food details");
                return StatusCode(500, new { error = "Failed to fetch food details" });
            }
        }
    }
}


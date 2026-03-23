using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    // Controllers/PersonalFoodsController.cs
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalFoodsController : ControllerBase
    {
        private readonly IPersonalFoodService _service;
        private readonly ILogger<PersonalFoodsController> _logger;

        public PersonalFoodsController(IPersonalFoodService service, ILogger<PersonalFoodsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        private int GetCurrentClientId()
        {
            var clientIdClaim = User.FindFirst("client_id")
                ?? User.FindFirst(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("Client ID not found");
            return int.Parse(clientIdClaim.Value);
        }

        /// <summary>
        /// Поиск по личной базе + опционально по FatSecret (через параметр)
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchFoods(
            [FromQuery] string query,
            [FromQuery] bool includeFatSecret = true,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
                return Ok(new List<FoodSearchResultDto>());

            var clientId = GetCurrentClientId();
            var results = new List<FoodSearchResultDto>();

            // 1. Ищем в личной базе
            var personalFoods = await _service.SearchPersonalFoodsAsync(clientId, query, ct);
            results.AddRange(personalFoods.Select(f => new FoodSearchResultDto
            {
                Source = "personal",
                PersonalFoodId = f.Id,
                Name = f.Name,
                Brand = f.Brand,
                CaloriesPer100g = f.CaloriesPer100g,
                ProteinPer100g = f.ProteinPer100g,
                CarbsPer100g = f.CarbsPer100g,
                FatPer100g = f.FatPer100g,
                DefaultUnit = f.DefaultUnit
            }));

            // 2. Опционально ищем в FatSecret (если есть сервис)
            // Раскомментируй, если нужно:
            /*
            if (includeFatSecret && _fatSecretService != null)
            {
                try
                {
                    var fatSecretJson = await _fatSecretService.SearchFoodsAsync(query, 5, ct);
                    // Парсинг ответа FatSecret → добавление в results
                    // (код парсинга опущен для краткости)
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to search FatSecret");
                }
            }
            */

            // Сортировка: сначала личные, потом по релевантности
            return Ok(results
                .OrderByDescending(r => r.Source == "personal")
                .ThenBy(r => r.Name)
                .Take(15));
        }

        [HttpPost]
        public async Task<IActionResult> AddPersonalFood([FromBody] CreatePersonalFoodDto dto, CancellationToken ct = default)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clientId = GetCurrentClientId();

            try
            {
                var created = await _service.AddPersonalFoodAsync(clientId, dto, ct);
                return CreatedAtAction(nameof(GetPersonalFood), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding personal food");
                return StatusCode(500, new { error = "Failed to add personal food" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPersonalFood(int id, CancellationToken ct = default)
        {
            var clientId = GetCurrentClientId();
            var food = await _service.GetPersonalFoodAsync(clientId, id, ct);

            if (food == null)
                return NotFound();

            return Ok(food);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersonalFood(int id, CancellationToken ct = default)
        {
            var clientId = GetCurrentClientId();
            var deleted = await _service.DeletePersonalFoodAsync(clientId, id, ct);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    
    }
}

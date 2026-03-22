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
        



        //Ниже - все старые методы контроллера!

        // Получаем ID текущего клиента из JWT токена
        //private int GetCurrentClientId()
        //{
        //    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int clientId))
        //    {
        //        throw new UnauthorizedAccessException("Не удалось определить пользователя");
        //    }
        //    return clientId;
        //}

        //// GET: api/nutrition/entries/today
        //[HttpGet("entries/today")]
        //public async Task<ActionResult<IEnumerable<MealEntryResponseDto>>> GetTodayEntries()
        //{
        //    try
        //    {
        //        var clientId = GetCurrentClientId();
        //        var today = DateOnly.FromDateTime(DateTime.Now);
        //        var entries = await _mealEntryService.GetByClientAndDateAsync(clientId, today);

        //        var response = entries.Select(e => new MealEntryResponseDto
        //        {
        //            Id = e.Id,
        //            EntryDate = e.EntryDate,
        //            EntryTime = e.EntryTime,
        //            MealType = e.MealType,
        //            FoodName = e.FoodName,
        //            Quantity = e.Quantity,
        //            Unit = e.Unit,
        //            Calories = e.Calories,
        //            Protein = e.Protein,
        //            Carbohydrates = e.Carbohydrates,
        //            Fat = e.Fat,
        //            Notes = e.Notes,
        //            CreatedAt = e.CreatedAt
        //        }).ToList();

        //        return Ok(response);
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        return Unauthorized(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при получении сегодняшних записей");
        //        return StatusCode(500, new { message = "Ошибка сервера" });
        //    }
        //}

        //// GET: api/nutrition/entries?date=2024-01-15
        //[HttpGet("entries")]
        //public async Task<ActionResult<IEnumerable<MealEntryResponseDto>>> GetEntriesByDate(
        //    [FromQuery] DateOnly date)
        //{
        //    try
        //    {
        //        var clientId = GetCurrentClientId();
        //        var entries = await _mealEntryService.GetByClientAndDateAsync(clientId, date);

        //        var response = entries.Select(e => new MealEntryResponseDto
        //        {
        //            Id = e.Id,
        //            EntryDate = e.EntryDate,
        //            EntryTime = e.EntryTime,
        //            MealType = e.MealType,
        //            FoodName = e.FoodName,
        //            Quantity = e.Quantity,
        //            Unit = e.Unit,
        //            Calories = e.Calories,
        //            Protein = e.Protein,
        //            Carbohydrates = e.Carbohydrates,
        //            Fat = e.Fat,
        //            Notes = e.Notes,
        //            CreatedAt = e.CreatedAt
        //        }).ToList();

        //        return Ok(response);
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        return Unauthorized(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при получении записей за дату {Date}", date);
        //        return StatusCode(500, new { message = "Ошибка сервера" });
        //    }
        //}

        //// POST: api/nutrition/entries
        //[HttpPost("entries")]
        //public async Task<ActionResult<MealEntryResponseDto>> CreateMealEntry(
        //    [FromBody] CreateMealEntryDto dto)
        //{
        //    try
        //    {
        //        if (dto == null)
        //        {
        //            return BadRequest(new { message = "Данные не могут быть пустыми" });
        //        }

        //        var clientId = GetCurrentClientId();
        //        var mealEntry = await _mealEntryService.CreateFromDtoAsync(clientId, dto);

        //        var response = new MealEntryResponseDto
        //        {
        //            Id = mealEntry.Id,
        //            EntryDate = mealEntry.EntryDate,
        //            EntryTime = mealEntry.EntryTime,
        //            MealType = mealEntry.MealType,
        //            FoodName = mealEntry.FoodName,
        //            Quantity = mealEntry.Quantity,
        //            Unit = mealEntry.Unit,
        //            Calories = mealEntry.Calories,
        //            Protein = mealEntry.Protein,
        //            Carbohydrates = mealEntry.Carbohydrates,
        //            Fat = mealEntry.Fat,
        //            Notes = mealEntry.Notes,
        //            CreatedAt = mealEntry.CreatedAt
        //        };

        //        return CreatedAtAction(nameof(GetEntriesByDate),
        //            new { date = mealEntry.EntryDate },
        //            response);
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        return Unauthorized(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при создании записи питания");
        //        return StatusCode(500, new { message = "Ошибка сервера" });
        //    }
        //}

        //// DELETE: api/nutrition/entries/{id}
        //[HttpDelete("entries/{id}")]
        //public async Task<IActionResult> DeleteMealEntry(int id)
        //{
        //    try
        //    {
        //        var clientId = GetCurrentClientId();

        //        // Проверяем, что запись принадлежит пользователю
        //        var entry = await _mealEntryService.GetByIdAsync(id);
        //        if (entry == null || entry.ClientId != clientId)
        //        {
        //            return NotFound(new { message = "Запись не найдена" });
        //        }

        //        var result = await _mealEntryService.DeleteAsync(id);

        //        if (!result)
        //        {
        //            return NotFound(new { message = "Запись не найдена" });
        //        }

        //        return NoContent();
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        return Unauthorized(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при удалении записи питания {Id}", id);
        //        return StatusCode(500, new { message = "Ошибка сервера" });
        //    }
        //}

        //// GET: api/nutrition/summary/today
        //[HttpGet("summary/today")]
        //public async Task<ActionResult<DailySummaryDto>> GetTodaySummary()
        //{
        //    try
        //    {
        //        var clientId = GetCurrentClientId();
        //        var today = DateOnly.FromDateTime(DateTime.Now);
        //        var summary = await _mealEntryService.GetDailySummaryAsync(clientId, today);

        //        return Ok(summary);
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        return Unauthorized(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при получении сегодняшней статистики");
        //        return StatusCode(500, new { message = "Ошибка сервера" });
        //    }
        //}

        //// GET: api/nutrition/summary?date=2024-01-15
        //[HttpGet("summary")]
        //public async Task<ActionResult<DailySummaryDto>> GetSummaryByDate(
        //    [FromQuery] DateOnly date)
        //{
        //    try
        //    {
        //        var clientId = GetCurrentClientId();
        //        var summary = await _mealEntryService.GetDailySummaryAsync(clientId, date);

        //        return Ok(summary);
        //    }
        //    catch (UnauthorizedAccessException ex)
        //    {
        //        return Unauthorized(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при получении статистики за дату {Date}", date);
        //        return StatusCode(500, new { message = "Ошибка сервера" });
        //    }
        //}

        //// GET: api/nutrition/meal-types
        //[HttpGet("meal-types")]
        //public ActionResult<IEnumerable<string>> GetMealTypes()
        //{
        //    return Ok(new[] { "breakfast", "lunch", "dinner", "snack", "other" });
        //}
    }
}


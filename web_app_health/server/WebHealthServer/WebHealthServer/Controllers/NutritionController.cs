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
        private readonly INutritionService _nutritionService;
        private readonly ILogger<NutritionController> _logger;
        public NutritionController(
        INutritionService nutritionService,
        ILogger<NutritionController> logger)
        {
            _nutritionService = nutritionService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchFoods([FromQuery] string query, [FromQuery] int limit = 10)
        {
            try
            {
                var results = await _nutritionService.SearchFoodsAsync(query, limit);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching foods");
                return StatusCode(500, new { error = "Ошибка при поиске продуктов" });
            }
        }

        // ➕ Добавить запись в дневник
        [HttpPost("diary")]
        public async Task<IActionResult> AddToDiary([FromBody] AddToDiaryDto dto)
        {
            try
            {
                var clientId = GetCurrentClientId();
                if (clientId == null)
                    return Unauthorized(new { error = "Пользователь не аутентифицирован" });

                var entry = await _nutritionService.AddToDiaryAsync(clientId.Value, dto);

                return Ok(); ;
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при добавлении записи в дневник");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        // 📋 Получить историю питания
        [HttpGet("diary/history")]
        public async Task<IActionResult> GetDiaryHistory(
            [FromQuery] DateOnly? from,
            [FromQuery] DateOnly? to)
        {
            try
            {
                var clientId = GetCurrentClientId();
                if (clientId == null)
                    return Unauthorized();

                var entries = await _nutritionService.GetDiaryHistoryAsync(clientId.Value, from, to);

                return Ok(new
                {
                    entries,
                    totalEntries = entries.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении истории питания");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        // 📊 Получить сводку по дням
        [HttpGet("diary/summary")]
        public async Task<IActionResult> GetDiarySummary(
            [FromQuery] DateOnly? from,
            [FromQuery] DateOnly? to)
        {
            try
            {
                var clientId = GetCurrentClientId();
                if (clientId == null)
                    return Unauthorized();

                var summary = await _nutritionService.GetDiarySummaryAsync(clientId.Value, from, to);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении сводки");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        // 🔹 Вспомогательный метод для получения ID клиента из токена
        private int? GetCurrentClientId()
        {
            var claim = User.FindFirst("nameidentifier");
            if (claim == null || !int.TryParse(claim.Value, out var clientId))
                return null;
            return clientId;
        }
        //[HttpGet("food/{foodId}")]
        //public async Task<IActionResult> GetFood(long foodId)
        //{
        //    var food = await _fatSecretService.GetFoodByIdAsync(foodId);

        //    if (food?.food == null)
        //    {
        //        return NotFound(new { message = "Food not found" });
        //    }

        //    return Ok(food);
        //}
        

        //[HttpGet("search")]
        //public async Task<IActionResult> SearchFoods([FromQuery] string query, [FromQuery] int limit = 10)
        //{
        //    if (string.IsNullOrWhiteSpace(query))
        //        return BadRequest(new { error = "Поисковый запрос не может быть пустым" });

        //    try
        //    {
        //        var results = await _fatSecretService.SearchFoodsAsync(query, limit);
        //        return Ok(results);
        //    }
        //    catch (HttpRequestException ex)
        //    {
        //        return StatusCode(502, new { error = "Ошибка при поиске в FatSecret API", details = ex.Message });
        //    }
        //}



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


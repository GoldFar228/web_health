using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebHealthServer.Data;
using WebHealthServer.DTOs.Wger;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WgerController : ControllerBase
    {
        private readonly IWgerService _wgerService;
        private readonly ILogger<WgerController> _logger;
        private readonly AppDbContext _context;

        public WgerController(
            IWgerService wgerService,
            ILogger<WgerController> logger,
            AppDbContext context)
        {
            _wgerService = wgerService;
            _logger = logger;
            _context = context;
        }

        [HttpGet("exercises")]
        public async Task<ActionResult<WgerExerciseListDto>> SearchExercises(
            [FromQuery] string? term,
            [FromQuery] int? category,
            [FromQuery] int? muscle,
            [FromQuery] int? equipment,
            [FromQuery] int limit = 5,
            [FromQuery] int offset = 0,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _wgerService.SearchExercisesAsync(
                    term, category, muscle, equipment, limit, offset, ct);

                _logger.LogInformation("Returning {Count} exercises", result.Count);
                return Ok(result);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error searching exercises");
                return StatusCode(502, new { error = "Failed to fetch data from Wger API" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error");
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("exercises/{id:int}")]
        public async Task<ActionResult<WgerExerciseInfoDto>> GetExerciseDetails(
    int id,
    CancellationToken ct = default)
        {
            try
            {
                var result = await _wgerService.GetExerciseInfoAsync(id, ct);
                _logger.LogInformation("Returning exercise: {Name} (ID: {Id})", result.Name, id);
                return Ok(result);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error getting exercise details");
                return StatusCode(502, new { error = "Failed to fetch from Wger API" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error");
                return NotFound(new { error = $"Exercise {id} not found", details = ex.Message });
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult<WgerCategoryListDto>> GetCategories(
            CancellationToken ct = default)
        {
            try
            {
                var result = await _wgerService.GetCategoriesAsync(ct);
                _logger.LogInformation("Returning {Count} categories", result.Results.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new { error = "Failed to fetch categories", details = ex.Message });
            }
        }

        [HttpGet("muscles")]
        public async Task<ActionResult<WgerMuscleListDto>> GetMuscles(
            CancellationToken ct = default)
        {
            try
            {
                var result = await _wgerService.GetMusclesAsync(ct);
                _logger.LogInformation("Returning {Count} muscles", result.Results.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting muscles");
                return StatusCode(500, new { error = "Failed to fetch muscles", details = ex.Message });
            }
        }

        [HttpGet("equipment")]
        public async Task<ActionResult<WgerEquipmentListDto>> GetEquipment(
            CancellationToken ct = default)
        {
            try
            {
                var result = await _wgerService.GetEquipmentAsync(ct);
                _logger.LogInformation("Returning {Count} equipment", result.Results.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting equipment");
                return StatusCode(500, new { error = "Failed to fetch equipment", details = ex.Message });
            }
        }

        [HttpGet("exercises/{id:int}/image")]
        public async Task<IActionResult> GetExerciseImage(
            int id,
            CancellationToken ct = default)
        {
            try
            {
                var image = await _wgerService.GetExerciseImageAsync(id, ct);
                if (image == null)
                    return NotFound();

                return File(image, "image/jpeg");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting exercise image");
                return StatusCode(500, new { error = "Failed to fetch image" });
            }
        }
        [HttpPost("exercises/details")]
        public async Task<IActionResult> GetExercisesDetails([FromBody] List<int> exerciseIds, CancellationToken ct = default)
        {
            try
            {
                var result = await _wgerService.GetExerciseDetailsBatchAsync(exerciseIds, ct);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting exercise details batch");
                return StatusCode(500, new { error = "Failed to fetch exercise details" });
            }
        }
        [HttpPost("exercises/sync-to-db")]
        public async Task<IActionResult> SyncExercisesToDb(
            [FromQuery] bool updateExisting = false,
            [FromQuery] int? category = null,
            [FromQuery] int batchSize = 100,    // ✅ Упражнений за запрос
            [FromQuery] int maxBatches = 5,     // ✅ Сколько страниц (100 * 5 = 500 упражнений)
            CancellationToken ct = default)
        {
            try
            {
                var exercises = await _wgerService.SyncExercisesToDbAsync(
                    updateExisting, category, batchSize, maxBatches, ct);

                return Ok(new
                {
                    message = $"Synced {exercises.Count} exercises",
                    totalProcessed = batchSize * maxBatches,
                    exercises = exercises.Select(e => new
                    {
                        localId = e.Id,
                        wgerId = e.WgerExerciseId,
                        e.Name,
                        e.Category
                    }).Take(20).ToList()  // Показываем первые 20
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing exercises");
                return StatusCode(500, new { error = "Failed to sync exercises", details = ex.Message });
            }
        }
        // ✅ Эндпоинт для получения локальных упражнений (для frontend)
        [HttpGet("exercises/local")]
        public async Task<IActionResult> GetLocalExercises(CancellationToken ct = default)
        {
            try
            {
                var exercises = await _wgerService.GetLocalExercisesAsync();

                return Ok(exercises.Select(e => new
                {
                    id = e.Id,              // ✅ Локальный ID для WorkoutSessionExercise
                    wgerExerciseId = e.WgerExerciseId,
                    e.Name,
                    e.Category,
                    e.MuscleGroup,
                    e.Description
                }).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting local exercises");
                return StatusCode(500, new { error = "Failed to get local exercises", details = ex.Message });
            }
        }
        [HttpPost("exercises/{id:int}/save-to-db")]
        public async Task<IActionResult> SaveExerciseToDb(
    int id,
    CancellationToken ct = default)
        {
            try
            {
                var exercise = await _wgerService.SaveExerciseToDbAsync(id, ct);

                return Ok(new
                {
                    message = "Exercise saved to local database",
                    localId = exercise.Id,      // ✅ Это ID используем в WorkoutSession!
                    wgerId = exercise.WgerExerciseId,
                    exercise.Name,
                    exercise.Category,
                    exercise.MuscleGroup
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving exercise {Id} to DB", id);
                return StatusCode(500, new { error = "Failed to save exercise", details = ex.Message });
            }
        }

        // ✅ Поиск с автосохранением (опционально)
        [HttpPost("exercises/search-and-save")]
        public async Task<IActionResult> SearchAndSaveExercises(
            [FromBody] List<int> exerciseIds,
            CancellationToken ct = default)
        {
            try
            {
                var savedExercises = new List<Exercise>();

                foreach (var id in exerciseIds)
                {
                    // ⏱️ Небольшая задержка между запросами (rate limit friendly)
                    await Task.Delay(200, ct);

                    var exercise = await _wgerService.SaveExerciseToDbAsync(id, ct);
                    savedExercises.Add(exercise);
                }

                return Ok(new
                {
                    message = $"Saved {savedExercises.Count} exercises",
                    exercises = savedExercises.Select(e => new
                    {
                        localId = e.Id,
                        wgerId = e.WgerExerciseId,
                        e.Name
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error batch saving exercises");
                return StatusCode(500, new { error = "Failed to save exercises", details = ex.Message });
            }
        }
    }

}

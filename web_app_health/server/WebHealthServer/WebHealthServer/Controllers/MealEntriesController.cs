using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebHealthServer.Models;
using WebHealthServer.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MealEntriesController : ControllerBase
{
    private readonly IMealEntryService _service;
    private readonly ILogger<MealEntriesController> _logger;

    public MealEntriesController(IMealEntryService service, ILogger<MealEntriesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    private int GetCurrentClientId()
    {
        var clientIdClaim = User.FindFirst("client_id")
            ?? User.FindFirst(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Client ID not found in token");

        if (!int.TryParse(clientIdClaim.Value, out var clientId))
            throw new UnauthorizedAccessException("Invalid client ID format");

        return clientId;
    }

    /// <summary>
    /// Получить записи за дату (по умолчанию — сегодня)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetEntries(
        [FromQuery] DateOnly? date,
        CancellationToken ct = default)
    {
        try
        {
            var clientId = GetCurrentClientId();
            var entries = await _service.GetEntriesByDateAsync(clientId, date ?? DateOnly.FromDateTime(DateTime.Today), ct);
            return Ok(entries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching meal entries");
            return StatusCode(500, new { error = "Failed to retrieve entries" });
        }
    }

    /// <summary>
    /// Получить записи за период
    /// </summary>
    [HttpGet("range")]
    public async Task<IActionResult> GetEntriesByRange(
        [FromQuery] DateOnly startDate,
        [FromQuery] DateOnly endDate,
        CancellationToken ct = default)
    {
        try
        {
            var clientId = GetCurrentClientId();
            var entries = await _service.GetEntriesByRangeAsync(clientId, startDate, endDate, ct);
            return Ok(entries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching meal entries for range");
            return StatusCode(500, new { error = "Failed to retrieve entries" });
        }
    }

    /// <summary>
    /// Получить сводку за день
    /// </summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetDailySummary(
        [FromQuery] DateOnly? date,
        CancellationToken ct = default)
    {
        try
        {
            var clientId = GetCurrentClientId();
            var summary = await _service.GetDailySummaryAsync(clientId, date ?? DateOnly.FromDateTime(DateTime.Today), ct);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating daily summary");
            return StatusCode(500, new { error = "Failed to calculate summary" });
        }
    }

    /// <summary>
    /// Добавить новую запись
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> AddEntry([FromBody] CreateMealEntryDto dto, CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));
            _logger.LogWarning("Model validation failed: {Errors}", errors);
            return BadRequest(new { error = "Validation failed", details = errors });
        }

        try
        {
            var clientId = GetCurrentClientId();
            var created = await _service.AddEntryAsync(clientId, dto, ct);
            return CreatedAtAction(nameof(GetEntries), new { date = created.EntryDate }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding meal entry");
            return StatusCode(500, new { error = "Failed to add entry" });
        }
    }

    /// <summary>
    /// Обновить существующую запись
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEntry(int id, [FromBody] CreateMealEntryDto dto, CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var clientId = GetCurrentClientId();
            var updated = await _service.UpdateEntryAsync(clientId, id, dto, ct);

            if (updated == null)
                return NotFound(new { error = "Entry not found or access denied" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating meal entry {EntryId}", id);
            return StatusCode(500, new { error = "Failed to update entry" });
        }
    }

    /// <summary>
    /// Удалить запись
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEntry(int id, CancellationToken ct = default)
    {
        try
        {
            var clientId = GetCurrentClientId();
            var deleted = await _service.DeleteEntryAsync(clientId, id, ct);

            if (!deleted)
                return NotFound(new { error = "Entry not found or access denied" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting meal entry {EntryId}", id);
            return StatusCode(500, new { error = "Failed to delete entry" });
        }
    }
}
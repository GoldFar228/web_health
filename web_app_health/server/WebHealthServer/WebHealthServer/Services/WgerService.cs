using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;
using WebHealthServer.DTOs.Wger;
using WebHealthServer.Models;
//using WebHealthServer.Models.WebHealthServer.DTOs.Wger;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IWgerService
    {
        Task<WgerExerciseInfoDto> GetExerciseInfoAsync(int exerciseId, CancellationToken ct = default);
        Task<WgerExerciseDto> GetExerciseDetailsAsync(int exerciseId, CancellationToken ct = default);
        Task<WgerCategoryListDto> GetCategoriesAsync(CancellationToken ct = default);
        Task<WgerMuscleListDto> GetMusclesAsync(CancellationToken ct = default);
        Task<WgerEquipmentListDto> GetEquipmentAsync(CancellationToken ct = default);
        Task<byte[]?> GetExerciseImageAsync(int exerciseId, CancellationToken ct = default);
        Task<Dictionary<int, WgerExerciseDto>> GetExerciseDetailsBatchAsync(List<int> exerciseIds, CancellationToken ct = default);
        Task<WgerExerciseListDto> SearchExercisesAsync(string? query = null, int? category = null, int? muscle = null, int? equipment = null, int limit = 20, int offset = 0, CancellationToken ct = default);
        
    }

    public class WgerService : IWgerService
    {
        private readonly WgerOptions _options;
        private readonly IMemoryCache _cache;
        private readonly ILogger<WgerService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        private static readonly JsonSerializerOptions WgerJsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = null // snake_case для Wger API
        };
        public WgerService(
            IOptions<WgerOptions> options,
            IMemoryCache cache,
            ILogger<WgerService> logger,
            IHttpClientFactory httpClientFactory)
        {
            _options = options.Value;
            _cache = cache;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        

        public async Task<WgerExerciseDto> GetExerciseDetailsAsync(
            int exerciseId, CancellationToken ct = default)
        {
            var cacheKey = $"wger_exercise_{exerciseId}_lang_{_options.LanguageId}";

            return await GetOrAddCacheAsync(cacheKey, TimeSpan.FromHours(1), async () =>
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                var url = $"exercise/{exerciseId}/?language={_options.LanguageId}";
                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}", _options.ApiBaseUrl, url);

                var response = await client.GetAsync(url, ct);
                var content = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Wger API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    throw new HttpRequestException($"Wger API returned {response.StatusCode}: {content}");
                }

                var jsonOptions = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
                };

                try
                {
                    var result = System.Text.Json.JsonSerializer.Deserialize<WgerExerciseDto>(
                        content, WgerJsonOptions); // ✅ Используем локальные настройки
                    return result ?? throw new InvalidOperationException($"Exercise {exerciseId} not found");
                }
                catch (System.Text.Json.JsonException ex)
                {
                    _logger.LogError(ex, "Failed to parse JSON response");
                    throw new InvalidOperationException($"Invalid JSON from Wger API: {ex.Message}", ex);
                }
            });
        }

        public async Task<WgerCategoryListDto> GetCategoriesAsync(CancellationToken ct = default)
        {
            return await GetOrAddCacheAsync("wger_categories", TimeSpan.FromHours(24), async () =>
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                // ИСПРАВЛЕНО: exercisecategory/ вместо category/
                var url = "exercisecategory/";
                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}", _options.ApiBaseUrl, url);

                var response = await client.GetAsync(url, ct);
                var content = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Wger API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    throw new HttpRequestException($"Wger API returned {response.StatusCode}: {content}");
                }

                var jsonOptions = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
                };

                try
                {
                    var result = System.Text.Json.JsonSerializer.Deserialize<WgerCategoryListDto>(
                        content, WgerJsonOptions); // ✅ Используем локальные настройки
                    return result ?? new WgerCategoryListDto();
                }
                catch (System.Text.Json.JsonException ex)
                {
                    _logger.LogError(ex, "Failed to parse JSON response");
                    throw new InvalidOperationException($"Invalid JSON from Wger API: {ex.Message}", ex);
                }
            });
        }

        public async Task<WgerMuscleListDto> GetMusclesAsync(CancellationToken ct = default)
        {
            return await GetOrAddCacheAsync("wger_muscles", TimeSpan.FromHours(24), async () =>
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                var url = "muscle/";
                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}", _options.ApiBaseUrl, url);

                var response = await client.GetAsync(url, ct);
                var content = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Wger API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    throw new HttpRequestException($"Wger API returned {response.StatusCode}: {content}");
                }

                var jsonOptions = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
                };

                try
                {
                    var result = System.Text.Json.JsonSerializer.Deserialize<WgerMuscleListDto>(
                        content, WgerJsonOptions); // ✅ Используем локальные настройки
                    return result ?? new WgerMuscleListDto();
                }
                catch (System.Text.Json.JsonException ex)
                {
                    _logger.LogError(ex, "Failed to parse JSON response");
                    throw new InvalidOperationException($"Invalid JSON from Wger API: {ex.Message}", ex);
                }
            });
        }

        public async Task<WgerEquipmentListDto> GetEquipmentAsync(CancellationToken ct = default)
        {
            return await GetOrAddCacheAsync("wger_equipment", TimeSpan.FromHours(24), async () =>
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                var url = "equipment/";
                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}", _options.ApiBaseUrl, url);

                var response = await client.GetAsync(url, ct);
                var content = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Wger API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    throw new HttpRequestException($"Wger API returned {response.StatusCode}: {content}");
                }

                var jsonOptions = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
                };

                try
                {
                    var result = System.Text.Json.JsonSerializer.Deserialize<WgerEquipmentListDto>(
                        content, WgerJsonOptions); // ✅ Используем локальные настройки
                    return result ?? new WgerEquipmentListDto();
                }
                catch (System.Text.Json.JsonException ex)
                {
                    _logger.LogError(ex, "Failed to parse JSON response");
                    throw new InvalidOperationException($"Invalid JSON from Wger API: {ex.Message}", ex);
                }
            });
        }

        public async Task<byte[]?> GetExerciseImageAsync(int exerciseId, CancellationToken ct = default)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);

                var url = $"exerciseimage/?exercise={exerciseId}";
                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}", _options.ApiBaseUrl, url);

                var response = await client.GetAsync(url, ct);

                if (!response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync(ct);
                    _logger.LogWarning("Wger image API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    return null;
                }

                return await response.Content.ReadAsByteArrayAsync(ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting exercise image");
                return null;
            }
        }

        private string BuildUrl(string endpoint, Dictionary<string, string> queryParams)
        {
            var queryString = string.Join("&", queryParams.Select(kvp =>
                $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));
            return $"{endpoint}?{queryString}";
        }

        private async Task<T> GetOrAddCacheAsync<T>(
            string key, TimeSpan expiration, Func<Task<T>> factory) where T : class
        {
            if (_cache.TryGetValue<T>(key, out var cached))
            {
                _logger.LogDebug("Cache hit for key: {Key}", key);
                return cached;
            }

            _logger.LogDebug("Cache miss for key: {Key}", key);

            try
            {
                var result = await factory();

                _cache.Set(key, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.UtcNow.Add(expiration)
                });

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Not caching failed result for key: {Key}", key);
                throw;
            }
        }
        public async Task<WgerExerciseInfoDto> GetExerciseInfoAsync(
        int exerciseId, CancellationToken ct = default)
        {
            var cacheKey = $"wger_exerciseinfo_{exerciseId}_lang_{_options.LanguageId}";

            return await GetOrAddCacheAsync(cacheKey, TimeSpan.FromHours(24), async () =>
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                var url = $"exerciseinfo/{exerciseId}/";

                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}",
                    _options.ApiBaseUrl.TrimEnd('/'), url);

                var response = await client.GetAsync(url, ct);
                var content = await response.Content.ReadAsStringAsync(ct);

                _logger.LogDebug("Wger API Response: {Content}",
                    content.Length > 500 ? content.Substring(0, 500) + "..." : content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Wger API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    throw new HttpRequestException($"Wger API returned {response.StatusCode}: {content}");
                }

                try
                {
                    var result = System.Text.Json.JsonSerializer.Deserialize<WgerExerciseInfoDto>(content, WgerJsonOptions);
                    return result ?? throw new InvalidOperationException($"Exercise {exerciseId} not found");
                }
                catch (System.Text.Json.JsonException ex)
                {
                    _logger.LogError(ex, "Failed to parse JSON response");
                    throw new InvalidOperationException($"Invalid JSON from Wger API: {ex.Message}", ex);
                }
            });
        }

        public Task<Dictionary<int, WgerExerciseDto>> GetExerciseDetailsBatchAsync(List<int> exerciseIds, CancellationToken ct = default)
        {
            throw new NotImplementedException();
        }
        public async Task<WgerExerciseListDto> SearchExercisesAsync(
    string? query = null, int? category = null, int? muscle = null,
    int? equipment = null, int limit = 5,  // ✅ ИЗМЕНИЛИ: 20 → 5
    int offset = 0,
    CancellationToken ct = default)
        {
            var queryParams = new Dictionary<string, string>
            {
                ["limit"] = limit.ToString(),
                ["offset"] = offset.ToString(),
                ["language"] = _options.LanguageId.ToString()
            };

            if (!string.IsNullOrWhiteSpace(query))
                queryParams["term"] = query;
            if (category.HasValue)
                queryParams["category"] = category.Value.ToString();
            if (muscle.HasValue)
                queryParams["muscles"] = muscle.Value.ToString();
            if (equipment.HasValue)
                queryParams["equipment"] = equipment.Value.ToString();

            var cacheKey = $"wger_exercises_{string.Join("_", queryParams.OrderBy(k => k.Key).Select(k => $"{k.Key}={k.Value}"))}";

            return await GetOrAddCacheAsync(cacheKey, TimeSpan.FromMinutes(30), async () =>
            {
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(_options.ApiBaseUrl);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                var url = BuildUrl("exercise/", queryParams);
                _logger.LogInformation("Calling Wger API: {BaseUrl}{Url}", _options.ApiBaseUrl, url);

                var response = await client.GetAsync(url, ct);
                var content = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Wger API error: {StatusCode} - {Content}",
                        response.StatusCode, content);
                    throw new HttpRequestException($"Wger API returned {response.StatusCode}: {content}");
                }

                var result = System.Text.Json.JsonSerializer.Deserialize<WgerExerciseListDto>(content, WgerJsonOptions)
                    ?? new WgerExerciseListDto();

                // ✅ ИЗМЕНИЛИ: обогащаем ВСЕ результаты (их теперь только 5)
                await EnrichExerciseNamesAsync(result.Results, ct);

                return result;
            });
        }

        private async Task EnrichExerciseNamesAsync(List<WgerExerciseDto> exercises, CancellationToken ct = default)
        {
            foreach (var exercise in exercises)
            {
                var cacheKey = $"wger_exercise_name_{exercise.Id}";

                if (!_cache.TryGetValue<string>(cacheKey, out var cachedName))
                {
                    try
                    {
                        var info = await GetExerciseInfoAsync(exercise.Id, ct);
                        if (!string.IsNullOrEmpty(info.Name))
                        {
                            _cache.Set(cacheKey, info.Name, TimeSpan.FromHours(24));
                            exercise.Name = info.Name; // ✅ Заполняем name!
                            exercise.Description = info.Description; // ✅ Заполняем description!
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to enrich name for exercise {Id}", exercise.Id);
                    }
                }
                else
                {
                    exercise.Name = cachedName;
                }
            }
        }
    }
}
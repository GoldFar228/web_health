
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class FatSecretService
    {
        private readonly HttpClient _httpClient;
        private readonly FatSecretOptions _options;
        private readonly IMemoryCache _cache;
        private readonly ILogger<FatSecretService> _logger;

        private static readonly SemaphoreSlim _tokenLock = new(1, 1);
        private const string TokenCacheKey = "fatsecret_access_token";

        public FatSecretService(
            HttpClient httpClient,
            IOptions<FatSecretOptions> options,
            IMemoryCache cache,
            ILogger<FatSecretService> logger)
        {
            _httpClient = httpClient;
            _options = options.Value;
            _cache = cache;
            _logger = logger;
        }

        /// <summary>
        /// Получает или обновляет access token с кэшированием
        /// </summary>
        private async Task<string> GetValidTokenAsync(CancellationToken ct = default)
        {
            // Пробуем взять из кэша
            if (_cache.TryGetValue<TokenResponseWrapper>(TokenCacheKey, out var cached)
                && cached.Token.IsValid)
            {
                return cached.Token.AccessToken;
            }

            await _tokenLock.WaitAsync(ct);
            try
            {
                // Double-check после получения лок
                if (_cache.TryGetValue<TokenResponseWrapper>(TokenCacheKey, out var recheck)
                    && recheck.Token.IsValid)
                {
                    return recheck.Token.AccessToken;
                }

                var token = await RequestNewTokenAsync(ct);

                // Кэшируем на время жизни токена минус 5 минут запаса
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.UtcNow.AddSeconds(token.ExpiresIn - 300)
                };

                _cache.Set(TokenCacheKey, new TokenResponseWrapper { Token = token }, cacheOptions);
                _logger.LogInformation("FatSecret token refreshed, expires at {ExpiresAt}", token.ExpiresAt);

                return token.AccessToken;
            }
            finally
            {
                _tokenLock.Release();
            }
        }

        /// <summary>
        /// Запрашивает новый токен у FatSecret
        /// </summary>
        private async Task<FatSecretTokenResponse> RequestNewTokenAsync(CancellationToken ct)
        {
            _logger.LogInformation("Requesting new FatSecret access token");

            // Basic Auth: client_id:client_secret в base64
            var credentials = Convert.ToBase64String(
                Encoding.ASCII.GetBytes($"{_options.ClientId}:{_options.ClientSecret}"));

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", credentials);

            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["scope"] = _options.Scope
            });

            var response = await _httpClient.PostAsync(_options.TokenUrl, content, ct);
            response.EnsureSuccessStatusCode();

            var tokenResponse = await response.Content.ReadFromJsonAsync<FatSecretTokenResponse>(cancellationToken: ct)
                ?? throw new InvalidOperationException("Failed to parse token response");

            // Рассчитываем реальное время истечения
            tokenResponse.ExpiresAt = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

            return tokenResponse;
        }

        /// <summary>
        /// Поиск продуктов по запросу
        /// </summary>
        public async Task<string> SearchFoodsAsync(string query, int maxResults = 10, CancellationToken ct = default)
        {
            var token = await GetValidTokenAsync(ct);

            var queryParams = new Dictionary<string, string>
            {
                ["method"] = "foods.search",
                ["search_expression"] = query,
                ["format"] = "json",
                ["max_results"] = maxResults.ToString(),
            };

            return await ExecuteApiRequestAsync(queryParams, token, ct);
        }

        /// <summary>
        /// Получение детальной информации о продукте по food_id
        /// </summary>
        public async Task<string> GetFoodDetailsAsync(string foodId, CancellationToken ct = default)
        {
            var token = await GetValidTokenAsync(ct);

            var queryParams = new Dictionary<string, string>
            {
                ["method"] = "food.get.v5",
                ["food_id"] = foodId,
                ["format"] = "json",
            };

            return await ExecuteApiRequestAsync(queryParams, token, ct);
        }

        /// <summary>
        /// Универсальный метод выполнения запроса к API
        /// </summary>
        private async Task<string> ExecuteApiRequestAsync(
            Dictionary<string, string> parameters,
            string accessToken,
            CancellationToken ct)
        {
            // Формируем строку запроса
            var queryString = string.Join("&",
                parameters.Select(kvp => $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));

            var requestUrl = $"{_options.ApiBaseUrl}?{queryString}";

            _logger.LogDebug("Calling FatSecret API: {Url}", requestUrl);

            // Добавляем Bearer token в заголовок [[1]]
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.PostAsync(requestUrl, null, ct);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("FatSecret API error: {StatusCode} - {Content}",
                    response.StatusCode, errorContent);
                throw new HttpRequestException($"FatSecret API returned {response.StatusCode}: {errorContent}");
            }

            return await response.Content.ReadAsStringAsync(ct);
        }
    }

    // Вспомогательная запись для кэша
    internal record TokenResponseWrapper
    {
        public required FatSecretTokenResponse Token { get; init; }
    }
}

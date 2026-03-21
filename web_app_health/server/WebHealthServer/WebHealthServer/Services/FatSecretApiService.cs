using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IFatSecretApiService
    {
        Task<FatSecretFoodResponse> GetFoodByIdAsync(long foodId);
        Task<FatSecretSearchResponse> SearchFoodsAsync(string query, int maxResults = 10);
    }

    public class FatSecretApiService : IFatSecretApiService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IFatSecretTokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly ILogger<FatSecretApiService> _logger;

        public FatSecretApiService(
            IHttpClientFactory httpClientFactory,
            IFatSecretTokenService tokenService,
            IConfiguration config,
            ILogger<FatSecretApiService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _tokenService = tokenService;
            _config = config;
            _logger = logger;
        }

        public async Task<FatSecretFoodResponse> GetFoodByIdAsync(long foodId)
        {
            try
            {
                var token = await _tokenService.GetAccessTokenAsync();
                var client = _httpClientFactory.CreateClient();

                // Используем URL-интеграцию (v5) - более современный подход [[10]]
                var url = $"{_config["FatSecret:ApiBaseUrl"]}/food/v5?food_id={foodId}&format=json";

                _logger.LogDebug("🚀 FatSecret Request URL: {Url}", url);
                _logger.LogDebug("🔑 Token present: {HasToken}", !string.IsNullOrEmpty(token));

                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", token);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await client.GetAsync(url);
                var rawContent = await response.Content.ReadAsStringAsync();
                response.EnsureSuccessStatusCode();

                _logger.LogInformation("📦 FatSecret Raw Response ({StatusCode}): {RawContent}",
                response.StatusCode, rawContent);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("❌ FatSecret API error: {StatusCode}, Body: {Body}",
                        response.StatusCode, rawContent);
                    return null;
                }

                // 🔹 Десериализация с правильными настройками
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true // Обязательно для snake_case
                };

                var result = JsonSerializer.Deserialize<FatSecretFoodResponse>(rawContent, options);

                // 🔹 Лог 3: Результат десериализации
                if (result?.food == null)
                {
                    _logger.LogWarning("⚠️ Deserialized result has null food property");
                }
                else
                {
                    _logger.LogInformation("✅ Successfully parsed food: {FoodName}", result.food.food_name);
                }

                return result;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Exception in GetFoodByIdAsync");
                throw; // Пробрасываем ошибку, чтобы увидеть её в Swagger
            }

        }

        public async Task<FatSecretSearchResponse> SearchFoodsAsync(string query, int maxResults = 10)
        {
                var token = await _tokenService.GetAccessTokenAsync();
                var client = _httpClientFactory.CreateClient();

                var url = $"{_config["FatSecret:ApiBaseUrl"]}/server.api";

                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("method", "foods.search.v5"),
                    new KeyValuePair<string, string>("search_expression", query),
                    new KeyValuePair<string, string>("max_results", maxResults.ToString()),
                    new KeyValuePair<string, string>("format", "json")
                });

                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", token);

                var response = await client.PostAsync(url, content);
                var rawContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("🔍 Search Raw Response: {RawContent}", rawContent);

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                return JsonSerializer.Deserialize<FatSecretSearchResponse>(rawContent, options);
            }

        //public async Task<FatSecretFoodResponse> GetFoodByIdAsync(string query, int maxResults = 10)
        //{

        //}
    }
}

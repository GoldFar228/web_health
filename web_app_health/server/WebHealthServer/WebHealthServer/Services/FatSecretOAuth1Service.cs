using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using RestSharp;
using RestSharp.Authenticators;
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
    public interface IFatSecretOAuth1Service
    {
        Task<FatSecretFoodResponse?> GetFoodByIdAsync(long foodId);
        Task<FatSecretFoodResponse?> SearchFoodsAsync(string query, int maxResults = 10);
    }

    public class FatSecretOAuth1Service : IFatSecretOAuth1Service
    {
        private readonly IConfiguration _config;
        private readonly ILogger<FatSecretOAuth1Service> _logger;

        public FatSecretOAuth1Service(IConfiguration config, ILogger<FatSecretOAuth1Service> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<FatSecretFoodResponse?> GetFoodByIdAsync(long foodId)
        {
            var baseUrl = _config["FatSecret:OAuth1:BaseUrl"];
            var consumerKey = _config["FatSecret:OAuth1:ConsumerKey"];
            var consumerSecret = _config["FatSecret:OAuth1:ConsumerSecret"];

            // Создаем клиент с аутентификатором OAuth 1.0a
            var client = new RestClient(baseUrl);
            var authenticator = OAuth1Authenticator.ForRequestToken(
                consumerKey,
                consumerSecret
            );

            // Формируем запрос (метод GET)
            var request = new RestRequest("server.api", Method.Get);
            request.AddParameter("method", "food.get.v5");
            request.AddParameter("food_id", foodId);
            request.AddParameter("format", "json");

            // Применяем подпись
            request.Authenticator = authenticator;

            try
            {
                var response = await client.ExecuteAsync(request);

                if (!response.IsSuccessful)
                {
                    _logger.LogError("FatSecret API error: {StatusCode} - {Content}",
                        response.StatusCode, response.Content);
                    return null;
                }

                // Десериализация с поддержкой snake_case
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return JsonSerializer.Deserialize<FatSecretFoodResponse>(response.Content!, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling FatSecret API");
                return null;
            }
        }

        public async Task<FatSecretFoodResponse?> SearchFoodsAsync(string query, int maxResults = 10)
        {
            var baseUrl = _config["FatSecret:OAuth1:BaseUrl"];
            var consumerKey = _config["FatSecret:OAuth1:ConsumerKey"];
            var consumerSecret = _config["FatSecret:OAuth1:ConsumerSecret"];

            var client = new RestClient(baseUrl);
            var authenticator = OAuth1Authenticator.ForRequestToken(
                consumerKey,
                consumerSecret
            );

            // Для поиска используем метод foods.search.v5
            var request = new RestRequest("server.api", Method.Get);
            request.AddParameter("method", "foods.search.v5");
            request.AddParameter("search_expression", query);
            request.AddParameter("max_results", maxResults);
            request.AddParameter("format", "json");

            request.Authenticator = authenticator;

            try
            {
                var response = await client.ExecuteAsync(request);

                if (!response.IsSuccessful)
                {
                    _logger.LogError("FatSecret Search error: {StatusCode} - {Content}",
                        response.StatusCode, response.Content);
                    return null;
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return JsonSerializer.Deserialize<FatSecretFoodResponse>(response.Content!, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching FatSecret");
                return null;
            }
        }
    }
}

using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using WebHealthServer.Models;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public interface IFatSecretTokenService
    {
        Task<string> GetAccessTokenAsync();
    }

    public class FatSecretTokenService : IFatSecretTokenService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;
        private readonly string _cacheKey = "fatsecret_access_token";

        public FatSecretTokenService(
            IHttpClientFactory httpClientFactory,
            IConfiguration config,
            IMemoryCache cache)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
            _cache = cache;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            // Проверяем кэш
            if (_cache.TryGetValue(_cacheKey, out string cachedToken))
            {
                return cachedToken;
            }

            var client = _httpClientFactory.CreateClient();
            var clientId = _config["FatSecret:ClientId"];
            var clientSecret = _config["FatSecret:ClientSecret"];
            var scope = _config["FatSecret:Scope"] ?? "basic";

            // Basic Auth: base64(client_id:client_secret)
            var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);

            var content = new FormUrlEncodedContent(new[]
            {
            new KeyValuePair<string, string>("grant_type", "client_credentials"),
            new KeyValuePair<string, string>("scope", scope)
        });

            var response = await client.PostAsync(
                _config["FatSecret:TokenUrl"],
                content);

            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<FatSecretTokenResponse>(responseString);

            // Кэшируем токен на время, чуть меньшее времени жизни (чтобы успеть обновить)
            var cacheDuration = TimeSpan.FromSeconds(tokenResponse.expires_in - 300); // -5 минут
            _cache.Set(_cacheKey, tokenResponse.access_token, cacheDuration);

            return tokenResponse.access_token;
        }
    }
}

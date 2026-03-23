using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    // Options/FatSecretOptions.cs
    public class FatSecretOptions
    {
        public const string SectionName = "FatSecret";

        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string Scope { get; set; } = "basic";
        public string TokenUrl { get; set; } = "https://oauth.fatsecret.com/connect/token";
        public string ApiBaseUrl { get; set; } = "https://platform.fatsecret.com/rest/server.api";
        public string Locale { get; set; } = "ru_RU"; // По умолчанию русская локаль
    }
}
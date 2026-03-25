using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using WebHealthServer.Data;
using WebHealthServer.Models;

namespace WebHealthServer.Repositories
{
    public class WgerOptions
    {
        public const string SectionName = "Wger";

        /// <summary>
        /// Базовый URL API Wger
        /// </summary>
        public string ApiBaseUrl { get; set; } = "https://wger.de/api/v2";

        /// <summary>
        /// API ключ для авторизованных endpoints (опционально)
        /// </summary>
        public string? ApiKey { get; set; }

        /// <summary>
        /// Язык результатов (en=2, de=1, ru=5 и т.д.)
        /// </summary>
        public int LanguageId { get; set; } = 2; // English by default

        /// <summary>
        /// Таймаут запросов в секундах
        /// </summary>
        public int TimeoutSeconds { get; set; } = 30;
    }
}
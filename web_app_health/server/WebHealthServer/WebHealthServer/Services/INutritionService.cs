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
    public interface INutritionService
    {
        // Поиск продуктов во внешнем справочнике
        Task<object> SearchFoodsAsync(string query, int limit = 10);

        // Добавление записи в дневник
        Task<MealEntry> AddToDiaryAsync(int clientId, AddToDiaryDto dto);

        // Получение истории питания
        Task<List<MealEntry>> GetDiaryHistoryAsync(int clientId, DateOnly? from, DateOnly? to);

        // Опционально: агрегированная статистика
        Task<object> GetDiarySummaryAsync(int clientId, DateOnly? from, DateOnly? to);
    }

    
   
}

using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using WebHealthServer.Hubs;

namespace WebHealthServer.Middleware
{
        public class TokenExpirationMiddleware
        {
            private readonly RequestDelegate _next;
            private readonly ILogger<TokenExpirationMiddleware> _logger;

            public TokenExpirationMiddleware(
                RequestDelegate next,
                ILogger<TokenExpirationMiddleware> logger)
            {
                _next = next;
                _logger = logger;
            }

            public async Task InvokeAsync(HttpContext context, IHubContext<AuthHub> hubContext)
            {
                // Пропускаем запрос дальше по pipeline
                await _next(context);

                // Только для авторизованных пользователей
                if (context.User?.Identity?.IsAuthenticated == true)
                {
                    try
                    {
                        var expireClaim = context.User.FindFirst("exp");
                        if (expireClaim != null && long.TryParse(expireClaim.Value, out var expireTime))
                        {
                            var expirationDate = DateTimeOffset.FromUnixTimeSeconds(expireTime).UtcDateTime;
                            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                            if (!string.IsNullOrEmpty(userId) && expirationDate > DateTime.UtcNow)
                            {
                                // Уведомляем за 1 минуту до истечения
                                var delay = expirationDate - DateTime.UtcNow - TimeSpan.FromMinutes(1);

                                if (delay > TimeSpan.Zero && delay < TimeSpan.FromHours(24))
                                {
                                    _logger.LogInformation(
                                        "Scheduling token expiration notification for user {UserId} in {Delay}",
                                        userId, delay);

                                    _ = Task.Delay(delay).ContinueWith(async _ =>
                                    {
                                        try
                                        {
                                            await hubContext.Clients.Group($"user-{userId}")
                                                .SendAsync("TokenExpiring");
                                            _logger.LogInformation(
                                                "Sent token expiration notification to user {UserId}", userId);
                                        }
                                        catch (Exception ex)
                                        {
                                            _logger.LogError(ex,
                                                "Failed to send token expiration notification to user {UserId}",
                                                userId);
                                        }
                                    }, TaskScheduler.Default);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error in TokenExpirationMiddleware");
                    }
                }
            }
        }

        // Extension method для удобной регистрации
        public static class TokenExpirationMiddlewareExtensions
        {
            public static IApplicationBuilder UseTokenExpirationMiddleware(
                this IApplicationBuilder builder)
            {
                return builder.UseMiddleware<TokenExpirationMiddleware>();
            }
        }
    
}

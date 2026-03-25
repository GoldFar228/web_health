using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Threading.Tasks;
using WebHealthServer.Models;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

namespace WebHealthServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CacheController : ControllerBase
    {
        private readonly IMemoryCache _cache;

        public CacheController(IMemoryCache cache)
        {
            _cache = cache;
        }

        [HttpPost("clear")]
        public IActionResult Clear()
        {
            if (_cache is MemoryCache memoryCache)
            {
                memoryCache.Clear();
                return Ok(new { message = "Cache cleared" });
            }
            return Ok(new { message = "Cache cleared" });
        }

        [HttpPost("clear/{key}")]
        public IActionResult ClearKey(string key)
        {
            _cache.Remove(key);
            return Ok(new { message = $"Key {key} removed" });
        }
    }
}

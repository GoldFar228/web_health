using AutoMapper;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using WebHealthServer.Data;
using WebHealthServer.Models;
using WebHealthServer.Models.Enums;
using WebHealthServer.Repositories;

namespace WebHealthServer.Services
{
    public class AuthService
    {
        private readonly ClientRepository _clientRepository;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly JwtService _service;

        public AuthService(IMapper mapper, AppDbContext context, JwtService service)
        {
            _mapper = mapper;
            _context = context;
            _service = service;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest login)
        {
            var user = await _context.Clients
                 .FirstOrDefaultAsync(u => u.Email == login.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                return new AuthResponse(null, "Неверная почта или пароль");
            else
            {
                return new AuthResponse(_service.GenerateToken(user));
            }
        }
        public async Task<AuthResponse> RegisterAsync(ClientDTO register)
        {

            var exists = await _context.Clients
                .AnyAsync(u => u.Email == register.Email);

            if (exists) return new AuthResponse(null, "User exists");

            var user = _mapper.Map<Client>(register); //позволяет избегать писанины, которую ниже закомментировал

            //var user = new Client
            //{
            //    LastName = register.LastName,
            //    FirstName = register.FirstName,
            //    Email = register.Email,
            //    Password = BCrypt.Net.BCrypt.HashPassword(register.Password),
            //    PhoneNumber = register.Phone,
            //    Role = UserRoleEnum.User
            //};

            await _context.Clients.AddAsync(user);
            await _context.SaveChangesAsync();
            return new AuthResponse(_service.GenerateToken(user));
        }
    }
    public record class AuthResponse(string? Token, string? ErrorMessage = null);
}

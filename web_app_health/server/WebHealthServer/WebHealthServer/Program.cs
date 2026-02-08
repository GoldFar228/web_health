using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebHealthServer.Data;
using WebHealthServer.Hubs;
using WebHealthServer.Middleware;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(7073, listenOptions => listenOptions.UseHttps());
});
builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Convert.FromBase64String(builder.Configuration["Jwt:Key"]))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Path.StartsWithSegments("/hubs/auth"))
                {
                    var accessToken = context.Request.Query["access_token"];
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        context.Token = accessToken;
                    }
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Добавляем Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connStr = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connStr));

builder.Services.AddAutoMapper(x => x.AddProfile<MapperProfile>()); // ← добавление маппера
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // ← твой React-клиент
              .AllowCredentials() // ← обязательно!
              .AllowAnyMethod()
              .AllowAnyHeader();
        });
});
//Добавление репозиториев
builder.Services.AddScoped(typeof(IRepository<>), typeof(AbstractRepository<>));
builder.Services.AddScoped<ClientRepository>();
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<CoachRepository>();
builder.Services.AddScoped<CoachService>();
builder.Services.AddScoped<DietRepository>();
builder.Services.AddScoped<DietService>();
builder.Services.AddScoped<ExerciseRepository>();
builder.Services.AddScoped<ExerciseService>();
builder.Services.AddScoped<TrainingProgramRepository>();
builder.Services.AddScoped<TrainingProgramService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>(); 
builder.Services.AddSignalR();
builder.Services.AddHttpContextAccessor();
var app = builder.Build();

app.UseHttpsRedirection();
app.UseWebSockets(); // ← ДО UseRouting()
app.UseRouting(); // ← SignalR требует маршрутизацию
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();


// Маршрут для SignalR
app.MapHub<AuthHub>("/hubs/auth");

app.MapControllers();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.MapOpenApi();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    //var data = dbContext.Clients.ToList();
    dbContext.Database.Migrate(); // или используйте это вместо Update-Database
}

app.Run();

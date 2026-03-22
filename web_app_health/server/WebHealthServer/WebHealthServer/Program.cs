using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
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
//builder.Services.AddOpenApi();

// Добавляем Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Fitness API",
        Version = "v1",
        Description = "API для управления фитнес-приложением"
    });

    // Добавляем схему авторизации Bearer
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Введите токен JWT в формате: Bearer {your token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    // Применяем авторизацию ко всем операциям
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Добавляем информацию о файлах (если используешь)
    //c.EnableAnnotations();
});

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
builder.Services.Configure<FatSecretOptions>(
    builder.Configuration.GetSection(FatSecretOptions.SectionName));
// MemoryCache для кэширования токена
builder.Services.AddMemoryCache();

builder.Services.AddHttpClient<FatSecretService>(client =>
{
    client.BaseAddress = new Uri("https://platform.fatsecret.com");
    client.DefaultRequestHeaders.Accept.Add(
        new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
});
// HttpClient для внешних запросов
builder.Services.AddHttpClient();
//Добавление репозиториев
builder.Services.AddScoped<IMealEntryService, MealEntryService>();
builder.Services.AddScoped<FatSecretService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(FatSecretOptions<>));
builder.Services.AddScoped<ClientRepository>();
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<CoachRepository>();
builder.Services.AddScoped<CoachService>();
builder.Services.AddScoped<DietRepository>();
builder.Services.AddScoped<DietService>();
builder.Services.AddScoped<MealEntryRepository>();
builder.Services.AddScoped<MealEntryService>();
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
    //app.MapOpenApi();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    //var data = dbContext.Clients.ToList();
    dbContext.Database.Migrate(); // или используйте это вместо Update-Database
}

app.Run();

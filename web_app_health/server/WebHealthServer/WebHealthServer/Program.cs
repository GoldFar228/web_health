using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebHealthServer.Data;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
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

builder.Services.AddAutoMapper(cfg => { }, typeof(Program)); // ← добавление маппера

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
var app = builder.Build();

app.UseAuthentication(); 
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.MapOpenApi();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    //var data = dbContext.Clients.ToList();
    dbContext.Database.Migrate(); // или используйте это вместо Update-Database
}

app.Run();

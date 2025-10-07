using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WebHealthServer.Data;
using WebHealthServer.Repositories;
using WebHealthServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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
var app = builder.Build();

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

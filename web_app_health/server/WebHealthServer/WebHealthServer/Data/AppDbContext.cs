using Microsoft.EntityFrameworkCore;
using WebHealthServer.Models;

namespace WebHealthServer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Client>().ToTable("Clients"); // явно указываем имя таблицы

        //    // Остальная конфигурация...
        //}
        public DbSet<Client> Clients { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<Exercise> Exercises{ get; set; }
        public DbSet<Diet> Diets{ get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }
        public DbSet<TrainingProgramExercise> TrainingProgramExercises { get; set; }
        public DbSet<MealEntry> MealEntries { get; set; }
        public DbSet<MealEntry> MealsEaten { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ...
            modelBuilder.Entity<MealEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ClientId);
                entity.HasIndex(e => e.EntryDate);
            });
        }
    }
}

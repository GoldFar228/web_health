using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class TrainingProgramsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Diets_Clients_ClientId",
                table: "Diets");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Clients_ClientId",
                table: "TrainingPrograms");

            migrationBuilder.DropIndex(
                name: "IX_TrainingPrograms_ClientId",
                table: "TrainingPrograms");

            migrationBuilder.DropIndex(
                name: "IX_Diets_ClientId",
                table: "Diets");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Diets");

            migrationBuilder.AddColumn<int>(
                name: "DaysPerWeek",
                table: "TrainingPrograms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TrainingPrograms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "TrainingPrograms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DurationWeeks",
                table: "TrainingPrograms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Goal",
                table: "TrainingPrograms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "TrainingPrograms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DietId",
                table: "Clients",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TrainingProgramId",
                table: "Clients",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TrainingProgramExercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    Sets = table.Column<int>(type: "integer", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    Weight = table.Column<int>(type: "integer", nullable: false),
                    RestBetweenSets = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    TrainingProgramId = table.Column<int>(type: "integer", nullable: false),
                    ExerciseId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingProgramExercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingProgramExercises_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrainingProgramExercises_TrainingPrograms_TrainingProgramId",
                        column: x => x.TrainingProgramId,
                        principalTable: "TrainingPrograms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_DietId",
                table: "Clients",
                column: "DietId");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_TrainingProgramId",
                table: "Clients",
                column: "TrainingProgramId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingProgramExercises_ExerciseId",
                table: "TrainingProgramExercises",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingProgramExercises_TrainingProgramId",
                table: "TrainingProgramExercises",
                column: "TrainingProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Diets_DietId",
                table: "Clients",
                column: "DietId",
                principalTable: "Diets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients",
                column: "TrainingProgramId",
                principalTable: "TrainingPrograms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Diets_DietId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "TrainingProgramExercises");

            migrationBuilder.DropIndex(
                name: "IX_Clients_DietId",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_TrainingProgramId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "DaysPerWeek",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "DurationWeeks",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "Goal",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "DietId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "TrainingProgramId",
                table: "Clients");

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Diets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingPrograms_ClientId",
                table: "TrainingPrograms",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Diets_ClientId",
                table: "Diets",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Diets_Clients_ClientId",
                table: "Diets",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Clients_ClientId",
                table: "TrainingPrograms",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

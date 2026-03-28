using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class WorkoutSessionExerciseJSONRealisation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualWeightKg",
                table: "WorkoutSessionExercises");

            migrationBuilder.RenameColumn(
                name: "ActualSets",
                table: "WorkoutSessionExercises",
                newName: "TotalReps");

            migrationBuilder.RenameColumn(
                name: "ActualReps",
                table: "WorkoutSessionExercises",
                newName: "CompletedSets");

            migrationBuilder.AddColumn<string>(
                name: "SetsJson",
                table: "WorkoutSessionExercises",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalTonnage",
                table: "WorkoutSessionExercises",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SetsJson",
                table: "WorkoutSessionExercises");

            migrationBuilder.DropColumn(
                name: "TotalTonnage",
                table: "WorkoutSessionExercises");

            migrationBuilder.RenameColumn(
                name: "TotalReps",
                table: "WorkoutSessionExercises",
                newName: "ActualSets");

            migrationBuilder.RenameColumn(
                name: "CompletedSets",
                table: "WorkoutSessionExercises",
                newName: "ActualReps");

            migrationBuilder.AddColumn<decimal>(
                name: "ActualWeightKg",
                table: "WorkoutSessionExercises",
                type: "numeric",
                nullable: true);
        }
    }
}

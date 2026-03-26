using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class WorkoutSessionsCorrections2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessions_TrainingPrograms_TrainingProgramId",
                table: "WorkoutSessions");

            migrationBuilder.DropIndex(
                name: "IX_WorkoutSessions_TrainingProgramId",
                table: "WorkoutSessions");

            migrationBuilder.DropColumn(
                name: "TrainingProgramId",
                table: "WorkoutSessions");

            migrationBuilder.DropColumn(
                name: "PlannedReps",
                table: "WorkoutSessionExercises");

            migrationBuilder.DropColumn(
                name: "PlannedSets",
                table: "WorkoutSessionExercises");

            migrationBuilder.DropColumn(
                name: "PlannedWeightKg",
                table: "WorkoutSessionExercises");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TrainingProgramId",
                table: "WorkoutSessions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlannedReps",
                table: "WorkoutSessionExercises",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlannedSets",
                table: "WorkoutSessionExercises",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlannedWeightKg",
                table: "WorkoutSessionExercises",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutSessions_TrainingProgramId",
                table: "WorkoutSessions",
                column: "TrainingProgramId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessions_TrainingPrograms_TrainingProgramId",
                table: "WorkoutSessions",
                column: "TrainingProgramId",
                principalTable: "TrainingPrograms",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}

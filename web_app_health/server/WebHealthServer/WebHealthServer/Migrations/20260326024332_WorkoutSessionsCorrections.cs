using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class WorkoutSessionsCorrections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessions_TrainingPrograms_TrainingProgramId",
                table: "WorkoutSessions");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessions_TrainingPrograms_TrainingProgramId",
                table: "WorkoutSessions",
                column: "TrainingProgramId",
                principalTable: "TrainingPrograms",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessions_TrainingPrograms_TrainingProgramId",
                table: "WorkoutSessions");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessions_TrainingPrograms_TrainingProgramId",
                table: "WorkoutSessions",
                column: "TrainingProgramId",
                principalTable: "TrainingPrograms",
                principalColumn: "Id");
        }
    }
}

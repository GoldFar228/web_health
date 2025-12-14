using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class users_changed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients");

            migrationBuilder.DropIndex(
                name: "IX_Clients_TrainingProgramId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "TrainingProgramId",
                table: "Clients");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingPrograms_ClientId",
                table: "TrainingPrograms",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingPrograms_Clients_ClientId",
                table: "TrainingPrograms",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Clients_ClientId",
                table: "TrainingPrograms");

            migrationBuilder.DropIndex(
                name: "IX_TrainingPrograms_ClientId",
                table: "TrainingPrograms");

            migrationBuilder.AddColumn<int>(
                name: "TrainingProgramId",
                table: "Clients",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clients_TrainingProgramId",
                table: "Clients",
                column: "TrainingProgramId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients",
                column: "TrainingProgramId",
                principalTable: "TrainingPrograms",
                principalColumn: "Id");
        }
    }
}

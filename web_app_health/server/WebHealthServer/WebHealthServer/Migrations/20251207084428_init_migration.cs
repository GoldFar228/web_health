using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class init_migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrainingPrograms_Clients_ClientId",
                table: "TrainingPrograms");

            migrationBuilder.DropIndex(
                name: "IX_TrainingPrograms_ClientId",
                table: "TrainingPrograms");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "TrainingPrograms");

            migrationBuilder.CreateTable(
                name: "ClientTrainingProgram",
                columns: table => new
                {
                    ClientsId = table.Column<int>(type: "integer", nullable: false),
                    TrainingProgramsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientTrainingProgram", x => new { x.ClientsId, x.TrainingProgramsId });
                    table.ForeignKey(
                        name: "FK_ClientTrainingProgram_Clients_ClientsId",
                        column: x => x.ClientsId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientTrainingProgram_TrainingPrograms_TrainingProgramsId",
                        column: x => x.TrainingProgramsId,
                        principalTable: "TrainingPrograms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientTrainingProgram_TrainingProgramsId",
                table: "ClientTrainingProgram",
                column: "TrainingProgramsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientTrainingProgram");

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "TrainingPrograms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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
    }
}

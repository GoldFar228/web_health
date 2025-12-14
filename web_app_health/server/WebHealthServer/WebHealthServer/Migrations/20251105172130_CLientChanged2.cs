using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class CLientChanged2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Coaches_CoachId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Diets_DietId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients");

            migrationBuilder.AlterColumn<int>(
                name: "TrainingProgramId",
                table: "Clients",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "DietId",
                table: "Clients",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "CoachId",
                table: "Clients",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Coaches_CoachId",
                table: "Clients",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Diets_DietId",
                table: "Clients",
                column: "DietId",
                principalTable: "Diets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients",
                column: "TrainingProgramId",
                principalTable: "TrainingPrograms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Coaches_CoachId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Diets_DietId",
                table: "Clients");

            migrationBuilder.DropForeignKey(
                name: "FK_Clients_TrainingPrograms_TrainingProgramId",
                table: "Clients");

            migrationBuilder.AlterColumn<int>(
                name: "TrainingProgramId",
                table: "Clients",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DietId",
                table: "Clients",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CoachId",
                table: "Clients",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Coaches_CoachId",
                table: "Clients",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
    }
}

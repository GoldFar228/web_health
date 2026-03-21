using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class addAPI : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealEntries_Clients_ClientId",
                table: "MealEntries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealEntries",
                table: "MealEntries");

            migrationBuilder.RenameTable(
                name: "MealEntries",
                newName: "MealEntry");

            migrationBuilder.RenameIndex(
                name: "IX_MealEntries_ClientId",
                table: "MealEntry",
                newName: "IX_MealEntry_ClientId");

            migrationBuilder.AddColumn<long>(
                name: "FatSecretFoodId",
                table: "MealEntry",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FatSecretFoodUrl",
                table: "MealEntry",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealEntry",
                table: "MealEntry",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_MealEntry_EntryDate",
                table: "MealEntry",
                column: "EntryDate");

            migrationBuilder.AddForeignKey(
                name: "FK_MealEntry_Clients_ClientId",
                table: "MealEntry",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealEntry_Clients_ClientId",
                table: "MealEntry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealEntry",
                table: "MealEntry");

            migrationBuilder.DropIndex(
                name: "IX_MealEntry_EntryDate",
                table: "MealEntry");

            migrationBuilder.DropColumn(
                name: "FatSecretFoodId",
                table: "MealEntry");

            migrationBuilder.DropColumn(
                name: "FatSecretFoodUrl",
                table: "MealEntry");

            migrationBuilder.RenameTable(
                name: "MealEntry",
                newName: "MealEntries");

            migrationBuilder.RenameIndex(
                name: "IX_MealEntry_ClientId",
                table: "MealEntries",
                newName: "IX_MealEntries_ClientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealEntries",
                table: "MealEntries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealEntries_Clients_ClientId",
                table: "MealEntries",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

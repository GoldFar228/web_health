using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class PersonalFoodHistoryAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealEntry_Clients_ClientId",
                table: "MealEntry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealEntry",
                table: "MealEntry");

            migrationBuilder.RenameTable(
                name: "MealEntry",
                newName: "MealEntries");

            migrationBuilder.RenameIndex(
                name: "IX_MealEntry_EntryDate",
                table: "MealEntries",
                newName: "IX_MealEntries_EntryDate");

            migrationBuilder.RenameIndex(
                name: "IX_MealEntry_ClientId",
                table: "MealEntries",
                newName: "IX_MealEntries_ClientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealEntries",
                table: "MealEntries",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "PersonalFoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Brand = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CaloriesPer100g = table.Column<decimal>(type: "numeric", nullable: false),
                    ProteinPer100g = table.Column<decimal>(type: "numeric", nullable: false),
                    CarbsPer100g = table.Column<decimal>(type: "numeric", nullable: false),
                    FatPer100g = table.Column<decimal>(type: "numeric", nullable: false),
                    DefaultUnit = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonalFoods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonalFoods_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PersonalFoods_ClientId",
                table: "PersonalFoods",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_MealEntries_Clients_ClientId",
                table: "MealEntries",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MealEntries_Clients_ClientId",
                table: "MealEntries");

            migrationBuilder.DropTable(
                name: "PersonalFoods");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MealEntries",
                table: "MealEntries");

            migrationBuilder.RenameTable(
                name: "MealEntries",
                newName: "MealEntry");

            migrationBuilder.RenameIndex(
                name: "IX_MealEntries_EntryDate",
                table: "MealEntry",
                newName: "IX_MealEntry_EntryDate");

            migrationBuilder.RenameIndex(
                name: "IX_MealEntries_ClientId",
                table: "MealEntry",
                newName: "IX_MealEntry_ClientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MealEntry",
                table: "MealEntry",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MealEntry_Clients_ClientId",
                table: "MealEntry",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

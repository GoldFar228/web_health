using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class personalFoodUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProteinPer100g",
                table: "PersonalFoods",
                newName: "ServingSize");

            migrationBuilder.RenameColumn(
                name: "FatPer100g",
                table: "PersonalFoods",
                newName: "ProteinPerServing");

            migrationBuilder.RenameColumn(
                name: "CarbsPer100g",
                table: "PersonalFoods",
                newName: "FatPerServing");

            migrationBuilder.RenameColumn(
                name: "CaloriesPer100g",
                table: "PersonalFoods",
                newName: "CarbsPerServing");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UsedAt",
                table: "PersonalFoods",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DefaultUnit",
                table: "PersonalFoods",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "CaloriesPerServing",
                table: "PersonalFoods",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsCaloriesAutoCalculated",
                table: "PersonalFoods",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CaloriesPerServing",
                table: "PersonalFoods");

            migrationBuilder.DropColumn(
                name: "IsCaloriesAutoCalculated",
                table: "PersonalFoods");

            migrationBuilder.RenameColumn(
                name: "ServingSize",
                table: "PersonalFoods",
                newName: "ProteinPer100g");

            migrationBuilder.RenameColumn(
                name: "ProteinPerServing",
                table: "PersonalFoods",
                newName: "FatPer100g");

            migrationBuilder.RenameColumn(
                name: "FatPerServing",
                table: "PersonalFoods",
                newName: "CarbsPer100g");

            migrationBuilder.RenameColumn(
                name: "CarbsPerServing",
                table: "PersonalFoods",
                newName: "CaloriesPer100g");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UsedAt",
                table: "PersonalFoods",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "DefaultUnit",
                table: "PersonalFoods",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}

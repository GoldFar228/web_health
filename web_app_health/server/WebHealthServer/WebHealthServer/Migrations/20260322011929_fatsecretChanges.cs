using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebHealthServer.Migrations
{
    /// <inheritdoc />
    public partial class fatsecretChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FatSecretFoodUrl",
                table: "MealEntry");

            migrationBuilder.AlterColumn<string>(
                name: "FatSecretFoodId",
                table: "MealEntry",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "FatSecretFoodId",
                table: "MealEntry",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FatSecretFoodUrl",
                table: "MealEntry",
                type: "text",
                nullable: true);
        }
    }
}

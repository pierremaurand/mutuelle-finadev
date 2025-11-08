using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mutuelleApi.Migrations
{
    /// <inheritdoc />
    public partial class update_mouvement_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Mouvements_Caisses_CaisseId",
                table: "Mouvements");

            migrationBuilder.AlterColumn<int>(
                name: "CaisseId",
                table: "Mouvements",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Mouvements_Caisses_CaisseId",
                table: "Mouvements",
                column: "CaisseId",
                principalTable: "Caisses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Mouvements_Caisses_CaisseId",
                table: "Mouvements");

            migrationBuilder.AlterColumn<int>(
                name: "CaisseId",
                table: "Mouvements",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Mouvements_Caisses_CaisseId",
                table: "Mouvements",
                column: "CaisseId",
                principalTable: "Caisses",
                principalColumn: "Id");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mutuelleApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBanqueEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BanqueId",
                table: "Mouvements",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Banques",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifieLe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiePar = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Banques", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Banques_Utilisateurs_ModifiePar",
                        column: x => x.ModifiePar,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mouvements_BanqueId",
                table: "Mouvements",
                column: "BanqueId");

            migrationBuilder.CreateIndex(
                name: "IX_Banques_ModifiePar",
                table: "Banques",
                column: "ModifiePar");

            migrationBuilder.AddForeignKey(
                name: "FK_Mouvements_Banques_BanqueId",
                table: "Mouvements",
                column: "BanqueId",
                principalTable: "Banques",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Mouvements_Banques_BanqueId",
                table: "Mouvements");

            migrationBuilder.DropTable(
                name: "Banques");

            migrationBuilder.DropIndex(
                name: "IX_Mouvements_BanqueId",
                table: "Mouvements");

            migrationBuilder.DropColumn(
                name: "BanqueId",
                table: "Mouvements");
        }
    }
}

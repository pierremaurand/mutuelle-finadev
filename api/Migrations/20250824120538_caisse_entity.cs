using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mutuelleApi.Migrations
{
    /// <inheritdoc />
    public partial class caisse_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CaisseId",
                table: "Mouvements",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Caisses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UtilisateurId = table.Column<int>(type: "int", nullable: false),
                    ModifieLe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiePar = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Caisses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Caisses_Utilisateurs_ModifiePar",
                        column: x => x.ModifiePar,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Caisses_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mouvements_CaisseId",
                table: "Mouvements",
                column: "CaisseId");

            migrationBuilder.CreateIndex(
                name: "IX_Caisses_ModifiePar",
                table: "Caisses",
                column: "ModifiePar");

            migrationBuilder.CreateIndex(
                name: "IX_Caisses_UtilisateurId",
                table: "Caisses",
                column: "UtilisateurId");

            migrationBuilder.AddForeignKey(
                name: "FK_Mouvements_Caisses_CaisseId",
                table: "Mouvements",
                column: "CaisseId",
                principalTable: "Caisses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Mouvements_Caisses_CaisseId",
                table: "Mouvements");

            migrationBuilder.DropTable(
                name: "Caisses");

            migrationBuilder.DropIndex(
                name: "IX_Mouvements_CaisseId",
                table: "Mouvements");

            migrationBuilder.DropColumn(
                name: "CaisseId",
                table: "Mouvements");
        }
    }
}

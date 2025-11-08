using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mutuelleApi.Migrations
{
    /// <inheritdoc />
    public partial class update_mouvement_entity_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Caisses_Utilisateurs_UtilisateurId",
                table: "Caisses");

            migrationBuilder.RenameColumn(
                name: "UtilisateurId",
                table: "Caisses",
                newName: "AgentId");

            migrationBuilder.RenameIndex(
                name: "IX_Caisses_UtilisateurId",
                table: "Caisses",
                newName: "IX_Caisses_AgentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Caisses_Utilisateurs_AgentId",
                table: "Caisses",
                column: "AgentId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Caisses_Utilisateurs_AgentId",
                table: "Caisses");

            migrationBuilder.RenameColumn(
                name: "AgentId",
                table: "Caisses",
                newName: "UtilisateurId");

            migrationBuilder.RenameIndex(
                name: "IX_Caisses_AgentId",
                table: "Caisses",
                newName: "IX_Caisses_UtilisateurId");

            migrationBuilder.AddForeignKey(
                name: "FK_Caisses_Utilisateurs_UtilisateurId",
                table: "Caisses",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

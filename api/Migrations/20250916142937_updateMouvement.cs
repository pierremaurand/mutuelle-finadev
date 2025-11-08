using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mutuelleApi.Migrations
{
    /// <inheritdoc />
    public partial class updateMouvement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions");

            migrationBuilder.AddColumn<double>(
                name: "MontantCapital",
                table: "Mouvements",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MontantCommission",
                table: "Mouvements",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MontantInterets",
                table: "Mouvements",
                type: "float",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions",
                column: "MembreId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions");

            migrationBuilder.DropColumn(
                name: "MontantCapital",
                table: "Mouvements");

            migrationBuilder.DropColumn(
                name: "MontantCommission",
                table: "Mouvements");

            migrationBuilder.DropColumn(
                name: "MontantInterets",
                table: "Mouvements");

            migrationBuilder.CreateIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions",
                column: "MembreId",
                unique: true);
        }
    }
}

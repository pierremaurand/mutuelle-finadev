using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mutuelleApi.Migrations
{
    /// <inheritdoc />
    public partial class updateMembre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions");

            migrationBuilder.CreateIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions",
                column: "MembreId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions");

            migrationBuilder.CreateIndex(
                name: "IX_Adhesions_MembreId",
                table: "Adhesions",
                column: "MembreId");
        }
    }
}

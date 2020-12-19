using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Purchases.Migrations
{
    public partial class AddInn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LoadID",
                table: "Purchases",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "SupplierINN",
                table: "Purchases",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoadID",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "SupplierINN",
                table: "Purchases");
        }
    }
}

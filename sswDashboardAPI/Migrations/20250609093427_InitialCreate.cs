using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sswDashboardAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmpId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EmailAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProjectsPassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HireDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResetToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResetTokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmpId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "TimeClock",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClockTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClockType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WeekNumber = table.Column<short>(type: "smallint", nullable: false),
                    Year = table.Column<short>(type: "smallint", nullable: false),
                    EmpId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Computer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Approval = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ManualSelect = table.Column<bool>(type: "bit", nullable: false),
                    Remote = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeClock", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimeClockFactory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClockTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClockType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WeekNumber = table.Column<short>(type: "smallint", nullable: false),
                    Year = table.Column<short>(type: "smallint", nullable: false),
                    EmpId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Computer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Approval = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ManualSelect = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeClockFactory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmpBasic",
                columns: table => new
                {
                    EmpId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupervisorId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmpStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    firstname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    expensecode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JcDept = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    company = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dcduserid = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cnvempid = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    city = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    state = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    zip = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    emgContact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    middleinitial = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmpBasic", x => x.EmpId);
                    table.ForeignKey(
                        name: "FK_EmpBasic_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmpBasic_RoleId",
                table: "EmpBasic",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmpBasic");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "TimeClock");

            migrationBuilder.DropTable(
                name: "TimeClockFactory");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}

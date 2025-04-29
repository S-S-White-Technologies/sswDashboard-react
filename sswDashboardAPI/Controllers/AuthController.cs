using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace sswDashboardAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                return BadRequest("Email and Password are required.");


            var user = await _db.Employees.FirstOrDefaultAsync(x => x.EmailAddress == loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid Email.");

            // Validate Password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.ProjectsPassword);

            if (!isPasswordValid)
                return Unauthorized("Invalid Password.");

            // Now get EmpBasic extra fields
            var empBasic = await _db.EmpBasic.FirstOrDefaultAsync(x => x.EmpId == user.EmpId);

            if (empBasic == null)
                return Unauthorized("Employee record not found.");

            // Generate JWT Token
            var token = GenerateJwtToken(user, empBasic);

            // Return Full User Object
            return Ok(new
            {
                uid = user.EmpId,
                email = user.EmailAddress,
                name = empBasic != null ? $"{empBasic.firstname} {empBasic.lastname}" : "Unknown",
                title = user?.Title,
               
                role = empBasic.Role,
                supervisorId = empBasic?.SupervisorId,
                empStatus = empBasic?.EmpStatus,
                expenseCode = empBasic?.expensecode,
                token = token
            });

        }

        private string GenerateJwtToken(Employee user, EmpBasic empBasics)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.EmpId),
        new Claim(ClaimTypes.Email, user.EmailAddress),
        new Claim(ClaimTypes.Role, empBasics?.Role?.RoleName ?? "User") 
    };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}

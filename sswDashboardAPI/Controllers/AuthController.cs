

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly AddEmailService _emailService;

    public AuthController(AppDbContext db, IConfiguration config, AddEmailService emailService)
    {
        _db = db;
        _config = config;
        _emailService = emailService;
    }

    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
    {


        if (string.IsNullOrEmpty(loginDto.EmailOrEmpId) || string.IsNullOrEmpty(loginDto.Password))
            return BadRequest("Email and Password are required.");

        var user = await _db.Employees.FirstOrDefaultAsync(x => x.EmailAddress == loginDto.EmailOrEmpId || x.EmpId == loginDto.EmailOrEmpId);
        if (user == null)
            return Unauthorized("Invalid Email or Emp ID.");

        var empBasic = await _db.EmpBasic
                .Include(e => e.Role)
                .FirstOrDefaultAsync(x => x.EmpID == user.EmpId);
        if (empBasic == null)
            return Unauthorized("Employee record not found.");

        bool isPasswordValid = false;
        bool isBcrypt = false;
        bool needsPasswordReset = false;


        if (!string.IsNullOrEmpty(user.ProjectsPassword) && user.ProjectsPassword.StartsWith("$2"))
        {
            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.ProjectsPassword);
                isBcrypt = true;
            }
            catch
            {
                
                return Unauthorized("Invalid Password.");
            }
        }

        
        if (!isBcrypt)
        {
            try
            {
                string decrypted = AesEncryptionHelper.DecryptOldVB(
                    user.ProjectsPassword,
                    "Jehym!",
                    "S@!tS@!tS@!t",
                    "SHA1",
                    7,
                    "@1f2c8e9e5Z2g7H9",
                    128
                );

                if (decrypted == loginDto.Password)
                {
                    isPasswordValid = true;
                    needsPasswordReset = true; 
                }
                else
                {
                    
                    needsPasswordReset = true;
                }
            }
            catch
            {
                
                needsPasswordReset = true;
            }
        }

        if (!isPasswordValid && !needsPasswordReset)
            return Unauthorized("Invalid Password.");
       

        var token = GenerateJwtToken(user, empBasic);

        return Ok(new
        {
            uid = user.EmpId,
            email = user.EmailAddress,
            name = $"{empBasic.FirstName} {empBasic.LastName}",
            title = user.Title,
            role = empBasic.Role?.RoleName ?? "User",
            supervisorId = empBasic.SupervisorID,
            empStatus = empBasic.EmpStatus,
            expenseCode = empBasic.ExpenseCode,
            department = empBasic.JCDept,
            imagePath = user.ImagePath,
            token = token,
            needsPasswordReset = needsPasswordReset
        });
    }


    private string GenerateJwtToken(Employee user, EmpBasic empBasic)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.EmpId),
            new Claim(ClaimTypes.Email, user.EmailAddress),
            new Claim(ClaimTypes.Role, empBasic.Role?.RoleName ?? "User")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
    {
        var user = await _db.Employees.FirstOrDefaultAsync(x => x.ResetToken == model.Token);
        if (user == null)
            return NotFound("Invalid or expired reset token.");

        user.ProjectsPassword = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
        user.ResetToken = null;
        
        await _db.SaveChangesAsync();

        return Ok("Password updated successfully.");
    }


    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
    {
        if (string.IsNullOrEmpty(model.Email))
            return BadRequest("Email is required.");

        var user = await _db.Employees.FirstOrDefaultAsync(u => u.EmailAddress == model.Email);
        if (user == null)
            return NotFound("No user found with this email.");

        
        var token = Guid.NewGuid().ToString(); 

        
        user.ResetToken = token;
        user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);
        await _db.SaveChangesAsync();

        // Send email
        //string resetLink = $"{_config["Frontend:BaseUrl"]}/reset-password?token={token}";
        string resetLink = $"http://localhost:3000/auth-pass-change-basic?token={token}";
        await _emailService.SendEmailAsync(user.EmailAddress, "Password Reset Request",
            $"Click the following link to reset your password: <a href='{resetLink}'>Reset Password</a>");

        return Ok(new { message = "Reset link has been sent to your email." });
    }

}


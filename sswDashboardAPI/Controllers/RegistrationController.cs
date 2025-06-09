using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services;

namespace sswDashboardAPI.Controllers
{
    [Route("api/registration")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly AppDbContext _mainDb;
        private readonly EpicorERPContext _epicorDb;
        private readonly EmployeeService _employeeService;
        private readonly EmailService _emailService;

        public RegistrationController(AppDbContext mainDb, EpicorERPContext epicorDb, EmployeeService employeeService , EmailService emailService)
        {
            _mainDb = mainDb;
            _epicorDb = epicorDb;
            _employeeService = employeeService;
            _emailService = emailService;
        }

        [HttpGet("next-empid")]
        public async Task<IActionResult> GetNextEmpId()
        {
            var maxEmpId = await _mainDb.EmpBasic
                .Where(e => string.Compare(e.EmpId, "3060") > 0 && string.Compare(e.EmpId, "4000") < 0)
                .MaxAsync(e => e.EmpId);

            if (int.TryParse(maxEmpId.ToString(), out int maxIdNum))
            {
                int nextId = maxIdNum + 1;
                return Ok(nextId.ToString());
            }

            return BadRequest("Invalid empid format.");
        }

        [HttpGet("supervisors")]
        public IActionResult GetSupervisors()
        {
            var supervisors = (from e in _mainDb.EmpBasic
                               join m in _mainDb.EmpBasic on e.SupervisorId equals m.EmpId
                               where m.Name != null && m.EmpStatus == "A"
                               select new
                               {
                                   m.EmpId,
                                   m.Name
                               }).Distinct().OrderBy(x => x.Name).ToList();

            return Ok(supervisors);
        }

        [HttpGet("departments")]
        public IActionResult GetDepartments()
        {
            var departments = _epicorDb.JcDept
                .Where(d => d.Company == "SSW")
                .Select(d => new
                {
                    id = d.JCDept,         
                    description = d.Description 
                })
                .Distinct()
                .ToList();

            return Ok(departments);
        }


        [HttpGet("roles")]
        public IActionResult GetRoles()
        {
            var roles = _mainDb.Roles
                .Select(r => new { r.RoleId, r.RoleName })
                .OrderBy(r => r.RoleId)
                .ToList();

            return Ok(roles);
        }


        //[HttpPost("add-employee")]
        //public async Task<IActionResult> AddEmployee([FromBody] EmployeeDto employeeDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var success1 = await _employeeService.InsertEmpBasicPLUTO(employeeDto);
        //    var success2 = await _employeeService.InsertEmployeeToEmployeesTable(employeeDto);

        //    if (success1 && success2)
        //        return Ok(new { message = "Employee inserted successfully." });

        //    return StatusCode(500, "Failed to insert employee.");
        //}

        [HttpPost("add-employee")] 
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            //var success3 = await _employeeService.UpdateKineticEmpBasicAsync(employeeDto);
            var success1 = await _employeeService.InsertEmpBasicPLUTO(employeeDto);
            var success2 = await _employeeService.InsertEmployeeToEmployeesTable(employeeDto);
            //var success3 = await _employeeService.UpdateKineticEmpBasicAsync(employeeDto);

            if (success1 && success2  )
            {
                
                string emailTemplatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailTemplates", "WelcomeEmail.html");

                if (System.IO.File.Exists(emailTemplatePath))
                {
                    string emailBody = await System.IO.File.ReadAllTextAsync(emailTemplatePath);

                  
                    emailBody = emailBody.Replace("{FirstName}", employeeDto.FirstName)
                                         .Replace("{LastName}", employeeDto.LastName)
                                         .Replace("{Email}", employeeDto.Email)
                                         .Replace("{Password}", employeeDto.Password);  

                    
                    string subject = "Welcome to SS White Technologies Dashboard";

                   
                    await _emailService.SendEmailAsync(employeeDto.Email, subject, emailBody);
                }
                else
                {
                    return StatusCode(500, "Email template not found.");
                }

                return Ok(new { message = "Employee inserted and email sent successfully." });
            }

            return StatusCode(500, "Failed to insert employee.");
        }



    }
}

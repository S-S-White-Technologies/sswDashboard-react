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
        private readonly AppDbContext _context;

        public RegistrationController(AppDbContext mainDb, EpicorERPContext epicorDb, EmployeeService employeeService , EmailService emailService, AppDbContext context)
        {
            _mainDb = mainDb;
            _epicorDb = epicorDb;
            _employeeService = employeeService;
            _emailService = emailService;
            _context = context; 
        }

        [HttpGet("next-empid")]
        public async Task<IActionResult> GetNextEmpId()
        {
            var maxEmpId = await _mainDb.EmpBasic
                .Where(e => string.Compare(e.EmpID, "3060") > 0 && string.Compare(e.EmpID, "4000") < 0)
                .MaxAsync(e => e.EmpID);

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
                               join m in _mainDb.EmpBasic on e.SupervisorID equals m.EmpID
                               where m.Name != null && m.EmpStatus == "A"
                               select new
                               {
                                   m.EmpID,
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
            var success3 = await _employeeService.InsertKineticEmpBasicAsync(employeeDto);
            var success2 = await _employeeService.InsertEmployeeToEmployeesTable(employeeDto);
            var success1 = await _employeeService.InsertEmpBasicPLUTO(employeeDto);
            
            //var success3 = await _employeeService.UpdateKineticEmpBasicAsync(employeeDto);

            if (success1 && success2 && success3 )
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

        [HttpGet("get-employee/{empId}")]
        public async Task<IActionResult> GetEmployee(string empId)
        {
            if (string.IsNullOrWhiteSpace(empId))
                return BadRequest("Employee ID is required.");

            var employee = await (from b in _context.EmpBasic
                                  join e in _context.Employees on b.EmpID equals e.EmpId
                                  join r in _context.Roles on b.RoleId equals r.RoleId into roleJoin
                                  from role in roleJoin.DefaultIfEmpty() // allows Role to be optional
                                  where b.EmpID == empId
                                  select new
                                  {
                                      empID = b.EmpID,
                                      firstName = b.FirstName,
                                      //mi = b.MiddleInitial,
                                      lastName = b.LastName,
                                      street1 = b.Address,
                                      street2 = b.Address2,
                                      city = b.City,
                                      state = b.State,
                                      country = b.Country,
                                      phone = b.Phone,
                                      emgContact = b.EmgContact,
                                      expenseCode = b.ExpenseCode,
                                      dept = b.JCDept,
                                      supervisor = b.SupervisorID,
                                      shift = b.Shift,
                                      hireDate = e.HireDate,
                                      roleId = b.RoleId,
                                      roleName = role != null ? role.RoleName : null,
                                      //email = b.EMailAddress,
                                      title = e.Title,
                                      empStatus = b.EmpStatus
                                  }).FirstOrDefaultAsync();

            if (employee == null)
                return NotFound("Employee not found.");

            return Ok(employee);
        }

       

    }
}

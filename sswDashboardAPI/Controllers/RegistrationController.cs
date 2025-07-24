using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Model.Time_and_Attendance;
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
        private readonly AddEmailService _emailService;
        private readonly AppDbContext _context;

        public RegistrationController(AppDbContext mainDb, EpicorERPContext epicorDb, EmployeeService employeeService , AddEmailService emailService, AppDbContext context)
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
                    id = d.JCDept1,         
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


       

        [HttpPost("add-employee")]
        public async Task<IActionResult> AddEmployee([FromForm] EmployeeDto employeeDto, IFormFile profileImage)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            
            if (profileImage != null && profileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(profileImage.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileImage.CopyToAsync(stream);
                }

               
                employeeDto.ImagePath = "/uploads/" + uniqueFileName;
            }
            else
            {
               
                employeeDto.ImagePath = "/uploads/logofinal.png";
            }

            
           var success3 = await _employeeService.InsertKineticEmpBasicAsync(employeeDto);
            var success2 = await _employeeService.InsertEmployeeToEmployeesTable(employeeDto);
            var success1 = await _employeeService.InsertEmpBasicPLUTO(employeeDto);

            if (success1 && success2 && success3)
            {
                return Ok(new { message = "Employee inserted successfully with image." });
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
                                  from role in roleJoin.DefaultIfEmpty() 
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
                                      zip = b.ZIP,
                                      dateofbirth = e.dob,
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
                                      email = e.EmailAddress,
                                      password = e.ProjectsPassword == null ? null : e.ProjectsPassword,
                                      title = e.Title,
                                      empStatus = b.EmpStatus,
                                      imagePath = e.ImagePath
                                  }).FirstOrDefaultAsync();

            if (employee == null)
                return NotFound("Employee not found.");

            return Ok(employee);
        }

      
        [HttpPut("update-employee")]
        public async Task<IActionResult> UpdateEmployee([FromBody] EmployeeDto employeeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _employeeService.UpdateEmployeeDetailsAsync(employeeDto);

            if (!updated)
                return StatusCode(500, "Failed to update employee details.");

            return Ok("Employee details updated successfully.");
        }

        [HttpPut("set-inactive")]
        public async Task<IActionResult> SetInactive([FromBody] EmpIdDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _employeeService.InactiveEmployeeDetailsAsync(dto);
            if (!result)
                return StatusCode(500, "Failed to mark employee inactive.");

            return Ok("Employee marked as inactive.");
        }







    }
}

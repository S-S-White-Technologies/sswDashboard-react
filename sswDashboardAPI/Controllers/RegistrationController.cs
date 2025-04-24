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

        public RegistrationController(AppDbContext mainDb, EpicorERPContext epicorDb, EmployeeService employeeService)
        {
            _mainDb = mainDb;
            _epicorDb = epicorDb;
            _employeeService = employeeService;
        }

        [HttpGet("next-empid")]
        public async Task<IActionResult> GetNextEmpId()
        {
            var maxEmpId = await _mainDb.EmpBasic
                .Where(e => string.Compare(e.EmpId, "3060") > 0 && string.Compare(e.EmpId, "4000") < 0)
                .MaxAsync(e => e.EmpId);

            if (int.TryParse(maxEmpId, out int maxIdNum))
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
                .Select(d => d.Description)
                .Distinct()
                .ToList();

            return Ok(departments);
        }


        [HttpPost("add-employee")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool success = await _employeeService.InsertEmpBasicPLUTO(dto);
            if (success)
                return Ok(new { message = "Employee added successfully." });

            return StatusCode(500, "Failed to add employee.");
        }


    }
}

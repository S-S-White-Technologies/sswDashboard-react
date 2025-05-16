using Microsoft.AspNetCore.Mvc;
using sswDashboardAPI.Services;

namespace sswDashboardAPI.Controllers.TimeandAttandance
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhosInBuildingController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public WhosInBuildingController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // Get Salaried Employees
        [HttpGet("salaried")]
        public IActionResult GetSalariedEmployees()
        {
            try
            {
                var salariedEmployees = _employeeService.GetEmployees("salaried", isUSA: true);
                return Ok(salariedEmployees);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Get Hourly Employees
        [HttpGet("hourly")]
        public IActionResult GetHourlyEmployees()
        {
            try
            {
                var hourlyEmployees = _employeeService.GetEmployees("hourly", isUSA: true);
                return Ok(hourlyEmployees);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using sswDashboardAPI.Model;
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


        [HttpGet("last-action/{EmpId}")]
        public async Task<ActionResult<LastActionResponse>> GetLastAction(string empId)
        {
            var lastAction = await _employeeService.GetLastAction(empId);

            if (lastAction.MaxTime == default(DateTime) && string.IsNullOrEmpty(lastAction.Status))
            {
                return NotFound("No data found for this employee.");
            }

            return Ok(lastAction);
        }


        [HttpPost("clock-in")]
        public async Task<IActionResult> ClockIn([FromBody] ClockInRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
            {
                return BadRequest("Employee ID is required.");
            }

            try
            {
                // Get the last action status to check if the user is already clocked in
                var lastAction = await _employeeService.GetLastAction(request.EmpId);

                if (lastAction != null && lastAction.Status == "IN")
                {
                    return BadRequest("You are already Clocked In.");
                }

                // Insert the Clock In record into the database
                var success = await _employeeService.ClockInForDay(request.EmpId, request.MyType);

                if (success)
                {
                    return Ok("Clock In successful.");
                }
                else
                {
                    return StatusCode(500, "Error in writing Clock In time. Please try again.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("clock-out")]
        public async Task<IActionResult> ClockOut([FromBody] ClockOutRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
            {
                return BadRequest("Employee ID is required.");
            }

            try
            {
                // Get the last action status to check if the user is currently clocked in
                var lastAction = await _employeeService.GetLastAction(request.EmpId);

                if (lastAction == null || lastAction.Status != "IN")
                {
                    return BadRequest("You are not currently clocked in.");
                }

                // Insert the Clock Out record into the database
                var success = await _employeeService.ClockOutForDay(request.EmpId);

                if (success)
                {
                    return Ok("Clock Out successful.");
                }
                else
                {
                    return StatusCode(500, "Error in writing Clock Out time. Please try again.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("clock-out-for-lunch")]
        public async Task<IActionResult> ClockOutForLunch([FromBody] ClockOutForLunchRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
            {
                return BadRequest("Employee ID is required.");
            }

            try
            {
                // Get the last action status to check if the user is currently clocked in
                var lastAction = await _employeeService.GetLastAction(request.EmpId);

                if (lastAction == null || lastAction.Status != "IN")
                {
                    return BadRequest("You are not currently clocked in.");
                }

                // Insert the Lunch Break record into the database
                var success = await _employeeService.ClockOutForLunch(request.EmpId);

                if (success)
                {
                    return Ok("Clocked out for lunch successfully.");
                }
                else
                {
                    return StatusCode(500, "Error in writing lunch break time. Please try again.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("work-time/{empId}")]
        public async Task<IActionResult> GetWorkTimeForDay(string empId)
        {
            DateTime reportDate = DateTime.Today; // Use today's date, or pass a date as a parameter.

            var workTime = await _employeeService.GetWorkTimeForDay(empId, reportDate);

            if (workTime == null || workTime.ClockInTime == null || workTime.ClockOutTime == null)
            {
                return NotFound("No clock-in or clock-out data found.");
            }

            // Calculate total worked time, subtracting break time
            double workDuration = (workTime.ClockOutTime - workTime.ClockInTime).Value.TotalMinutes;
            double breakDuration = workTime.BreakEndTime.HasValue && workTime.BreakStartTime.HasValue
                ? (workTime.BreakEndTime - workTime.BreakStartTime).Value.TotalMinutes
                : 0;

            double totalWorkedTime = workDuration - breakDuration;

            return Ok(new
            {
                workTime.ClockInTime,
                workTime.ClockOutTime,
                workTime.BreakStartTime,
                workTime.BreakEndTime,
                TotalWorkedTime = totalWorkedTime // In minutes
            });
        }

        [HttpGet("last-action-break/{empId}")]
        public async Task<ActionResult<LastActionResponse>> GetLastActionBreak(string empId)
        {
            var lastAction = await _employeeService.GetLastActionBreak(empId);

            if (lastAction.MaxTime == default(DateTime) && string.IsNullOrEmpty(lastAction.Status))
            {
                return NotFound("No data found for this employee.");
            }

            return Ok(lastAction);
        }


    }


}


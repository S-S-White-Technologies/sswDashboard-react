using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services;

namespace sswDashboardAPI.Controllers.TimeandAttandance
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhosInBuildingController : ControllerBase
    {
        private readonly EmployeeService _employeeService;
        private readonly AppDbContext _context;

        public WhosInBuildingController(EmployeeService employeeService, AppDbContext context)
        {
            _employeeService = employeeService;
            _context = context;
        }

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

        [HttpGet("userList")]
        public IActionResult GetUserList()
        {
            try
            {
                var salariedEmployees = _employeeService.GetUsers();
                return Ok(salariedEmployees);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


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

        //[HttpPost("clock-in")]
        //public async Task<IActionResult> ClockIn([FromBody] ClockInRequest request)
        //{
        //    if (string.IsNullOrEmpty(request.EmpId))
        //    {
        //        return BadRequest("Employee ID is required.");
        //    }

        //    try
        //    {
        //        // Get the last action status to check if the user is already clocked in
        //        var lastAction = await _employeeService.GetLastAction(request.EmpId);

        //        if (lastAction != null && lastAction.Status == "IN")
        //        {
        //            return BadRequest("You are already Clocked In.");
        //        }

        //        // Insert the Clock In record into the database
        //        var success = await _employeeService.ClockInForDay(request.EmpId, request.MyType);

        //        if (success)
        //        {

        //            var lastActionCheck = await _employeeService.GetLastAction(request.EmpId);
        //            return Ok("Clock In successful.");



        //        }
        //        else
        //        {
        //            return StatusCode(500, "Error in writing Clock In time. Please try again.");
        //        }


        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}

        [HttpPost("clock-in")]
        public async Task<IActionResult> ClockIn([FromBody] ClockInRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
                return BadRequest("Employee ID is required.");

            try
            {
                // STEP 1: Force a fresh read of the last action
                var lastAction = await _employeeService.GetLastAction(request.EmpId);

                if (lastAction != null && lastAction.Status == "IN")
                    return BadRequest("You are already Clocked In.");

                // STEP 2: Now insert the new clock-in record
                var success = await _employeeService.ClockInForDay(request.EmpId, request.MyType);

                if (success)
                {
                    var lastActionCheck = await _employeeService.GetLastAction(request.EmpId);
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


        [HttpPost("clock-out-for-business")]
        public async Task<IActionResult> ClockOutForBusiness([FromBody] ClockOutForLunchRequest request)
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
                var success = await _employeeService.ClockOutForBusiness(request.EmpId);

                if (success)
                {
                    return Ok("Clocked out for Business successfully.");
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

        [HttpPost("clock-out-for-personal")]
        public async Task<IActionResult> ClockOutForPersonal([FromBody] ClockOutForLunchRequest request)
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
                var success = await _employeeService.ClockOutForPersonal(request.EmpId);

                if (success)
                {
                    return Ok("Clocked out for Business successfully.");
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


        [HttpPost("clock-in-for-lunch")]
        public async Task<IActionResult> ClockInForLunch([FromBody] ClockOutForLunchRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
            {
                return BadRequest("Employee ID is required.");
            }

            try
            {
                // Get the last action status to check if the user is currently clocked in
                var lastAction = await _employeeService.GetLastActionBreak(request.EmpId);

                if (lastAction == null || lastAction.Status != "OUT")
                {
                    return BadRequest("You are not currently clocked OUT.");
                }

                // Insert the Lunch Break record into the database
                var success = await _employeeService.ClockInForLunch(request.EmpId);

                if (success)
                {
                    return Ok("Clocked In for lunch successfully.");
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

        [HttpPost("clock-in-for-business")]
        public async Task<IActionResult> ClockInForBusiness([FromBody] ClockOutForLunchRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
            {
                return BadRequest("Employee ID is required.");
            }

            try
            {
                // Get the last action status to check if the user is currently clocked in
                var lastAction = await _employeeService.GetLastActionBusiness(request.EmpId);

                if (lastAction == null || lastAction.Status != "OUT")
                {
                    return BadRequest("You are not currently clocked OUT.");
                }

                // Insert the Lunch Break record into the database
                var success = await _employeeService.ClockInForBusiness(request.EmpId);

                if (success)
                {
                    return Ok("Clocked In for lunch successfully.");
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

        [HttpPost("clock-in-for-personal")]
        public async Task<IActionResult> ClockInForPersonal([FromBody] ClockOutForLunchRequest request)
        {
            if (string.IsNullOrEmpty(request.EmpId))
            {
                return BadRequest("Employee ID is required.");
            }

            try
            {
                // Get the last action status to check if the user is currently clocked in
                var lastAction = await _employeeService.GetLastActionPersonal(request.EmpId);

                if (lastAction == null || lastAction.Status != "OUT")
                {
                    return BadRequest("You are not currently clocked OUT.");
                }

                // Insert the Lunch Break record into the database
                var success = await _employeeService.ClockInForPersonal(request.EmpId);

                if (success)
                {
                    return Ok("Clocked In for lunch successfully.");
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
            DateTime reportDate = DateTime.Today;

            var workTime = await _employeeService.GetWorkTimeForDay(empId, reportDate);

            if (workTime == null || workTime.ClockInTime == null)
            {
                return Ok(new List<object>());
            }
            double workDuration = 0;
            if (workTime.ClockOutTime.HasValue)
            {
                workDuration = (workTime.ClockOutTime - workTime.ClockInTime).Value.TotalMinutes;
            }
            else
            {
                workDuration = (DateTime.Now - workTime.ClockInTime.Value).TotalMinutes;
            }

            double breakDuration = workTime.BreakEndTime.HasValue && workTime.BreakStartTime.HasValue
                ? (workTime.BreakEndTime - workTime.BreakStartTime).Value.TotalMinutes
                : 0;

            double businessDuration = workTime.BusinessEndTime.HasValue && workTime.BusinessStartTime.HasValue
                ? (workTime.BusinessEndTime - workTime.BusinessStartTime).Value.TotalMinutes
                : 0;

            double personalDuration = workTime.PersonalEndTime.HasValue && workTime.PersonalStartTime.HasValue
                ? (workTime.PersonalEndTime - workTime.PersonalStartTime).Value.TotalMinutes
                : 0;

            double totalWorkedTimeInMinutes = workDuration - breakDuration - businessDuration - personalDuration;

            TimeSpan totalWorkedTime = TimeSpan.FromMinutes(totalWorkedTimeInMinutes);
            string totalWorkedTimeFormatted = totalWorkedTime.ToString(@"hh\:mm\:ss");

            return Ok(new
            {
                workTime.ClockInTime,
                workTime.ClockOutTime,
                workTime.BreakStartTime,
                workTime.BreakEndTime,
                workTime.BusinessStartTime,
                workTime.BusinessEndTime,
                workTime.PersonalStartTime,
                workTime.PersonalEndTime,
                BreakDuration = breakDuration,
                BusinessDuration = businessDuration,
                PersonalDuration = personalDuration,
                TotalWorkedTime = totalWorkedTimeFormatted
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

        [HttpGet("last-action-business/{empId}")]
        public async Task<ActionResult<LastActionResponse>> GetLastActionBusiness(string empId)
        {
            var lastAction = await _employeeService.GetLastActionBusiness(empId);

            if (lastAction.MaxTime == default(DateTime) && string.IsNullOrEmpty(lastAction.Status))
            {
                return NotFound("No data found for this employee.");
            }

            return Ok(lastAction);
        }

        [HttpGet("last-action-personal/{empId}")]
        public async Task<ActionResult<LastActionResponse>> GetLastActionPersonal(string empId)
        {
            var lastAction = await _employeeService.GetLastActionPersonal(empId);

            if (lastAction.MaxTime == default(DateTime) && string.IsNullOrEmpty(lastAction.Status))
            {
                return NotFound("No data found for this employee.");
            }

            return Ok(lastAction);
        }


        [HttpGet("supervisor-name/{empId}")]
        public IActionResult GetSupervisorName(string empId)
        {
            var name = _context.EmpBasic
                .Where(e => e.EmpID == empId)
                .Select(e => e.FirstName + " " + e.LastName)
                .FirstOrDefault();

            return Ok(new { name });
        }

    }


}



using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sswDashboardAPI.Services.HRModules;

namespace sswDashboardAPI.Controllers.HRReports
{
    [ApiController]
    [Route("api/[controller]")]
    public class PunchController : ControllerBase
    {
        private readonly PunchService _punchService;

        public PunchController(PunchService punchService)
        {
            _punchService = punchService;
        }

        [HttpGet("missing")]
        public async Task<IActionResult> GetMissingPunches(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                return BadRequest("Start date must be before end date.");
            }

            var result = await _punchService.GetMissingPunchesAsync(startDate, endDate);
            return Ok(result);
        }
    }


}

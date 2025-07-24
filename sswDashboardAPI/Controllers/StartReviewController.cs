using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services;

namespace sswDashboardAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StartReviewController : ControllerBase
    {

        private readonly IExemptedReviewService _reviewService;
        private readonly AppDbContext _context;

        public StartReviewController(IExemptedReviewService reviewService, AppDbContext context)
        {
            _reviewService = reviewService;
            _context = context;
        }

        [HttpPost("start-review")]
        public async Task<IActionResult> StartReview([FromBody] StartReviewDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.EmpId))
                return BadRequest("EmpId is required.");

            var result = await _reviewService.StartReviewAsync(dto);
            if (result)
                return Ok(new { message = "Review started and sent to employee." });

            return StatusCode(500, "Failed to start review.");
        }

    }

   

}

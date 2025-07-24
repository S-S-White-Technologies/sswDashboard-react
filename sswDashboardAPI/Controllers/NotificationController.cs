using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;

namespace sswDashboardAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

   
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPut("markread/{id}")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("employee-review/{reviewId}")]
        public async Task<IActionResult> GetEmployeeReview(Guid reviewId)
        {
            var review = await _context.ExemptedReviews.FindAsync(reviewId);
            if (review == null || review.CurrentStage != "Employee") return NotFound();

            return Ok(new
            {
                review.ReviewId,
                review.EmpId,
                review.EmployeeAnswers 
            });
        }

        [HttpPost("submit-employee")]
        public async Task<IActionResult> SubmitEmployeeReview(EmployeeReviewDto dto)
        {
            var review = await _context.ExemptedReviews.FindAsync(dto.ReviewId);
            if (review == null || review.CurrentStage != "Employee") return BadRequest();

            review.EmployeeAnswers = JsonConvert.SerializeObject(dto.Questions); // or EF JSON column
            review.EmployeeComplete = true;
            review.CurrentStage = "Manager";
            review.NotifiedManagerAt = DateTime.UtcNow;

            _context.Notifications.Add(new Notification
            {
                UserId = review.SupervisorId,
                Message = "A review form is ready for your input.",
                Link = $"/review/exempted/{dto.ReviewId}"
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}

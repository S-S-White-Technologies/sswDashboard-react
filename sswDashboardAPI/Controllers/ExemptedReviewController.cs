using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services;

[ApiController]
[Route("api/[controller]")]
public class ExemptedReviewController : ControllerBase
{
    private readonly IExemptedReviewService _reviewService;
    private readonly PdfService _pdfServices;
    private readonly AppDbContext _context;

    public ExemptedReviewController(IExemptedReviewService reviewService, AppDbContext context, PdfService pdfServices)
    {
        _reviewService = reviewService;
        _context = context;
        _pdfServices = pdfServices;
    }

    [HttpGet("eligible")]
    public async Task<IActionResult> GetEligibleEmployees()
    {
        var employees = await _reviewService.GetEligibleEmployeesAsync();
        return Ok(employees);
    }

    [HttpGet("completed")]
    public async Task<IActionResult> GetCompletedReview()
    {
        var completedReviews = await (
            from review in _context.ExemptedReviews
            join emp in _context.Employees on review.EmpId equals emp.EmpId
            join basic in _context.EmpBasic on review.EmpId equals basic.EmpID
            where review.CurrentStage == "Complete"
            select new
            {
                review.ReviewId,
                EmpID = review.EmpId,
                EmployeeFullName = basic.FirstName + " " + basic.LastName,
                EmployeeEmail = emp.EmailAddress,
                HireDate = emp.HireDate,
                review.SupervisorId,
                review.CreatedAt,
                review.CurrentStage
            }
        ).ToListAsync();

        return Ok(completedReviews);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetExemptedReview(Guid id)
    {
        var review = await _context.ExemptedReviews.FindAsync(id);
        if (review == null) return NotFound();

        var questions = string.IsNullOrEmpty(review.EmployeeAnswers)
            ? new Dictionary<string, string>()
            : JsonConvert.DeserializeObject<Dictionary<string, string>>(review.EmployeeAnswers);

        return Ok(new { questions });
    }

    [HttpPost("submit-employee")]
    public async Task<IActionResult> SubmitEmployeeReview([FromBody] EmployeeReviewDto dto)
    {
        if (dto == null || dto.ReviewId == Guid.Empty || dto.Questions == null)
            return BadRequest("Invalid input");

        var review = await _context.ExemptedReviews.FindAsync(dto.ReviewId);
        if (review == null || review.CurrentStage != "Employee")
            return BadRequest("Review not found or invalid stage");

        // Store full employee data including signature
        var data = new
        {
            Answers = dto.Questions,
            Signature = dto.Signature
        };
        review.EmployeeAnswers = JsonConvert.SerializeObject(data);
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




    ///For the Supervisor / Manager
    ///

    [HttpGet("supervisor/{id}")]
    public async Task<IActionResult> GetSupervisorReview(Guid id)
    {
        var review = await _context.ExemptedReviews.FindAsync(id);
        if (review == null) return NotFound();

        var ratings = string.IsNullOrEmpty(review.SupervisorRatings)
            ? new List<RatingDto>()
            : JsonConvert.DeserializeObject<List<RatingDto>>(review.SupervisorRatings);

        return Ok(new { ratings });
    }

    [HttpPost("submit-supervisor")]
    public async Task<IActionResult> SubmitSupervisorReview([FromBody] SupervisorReviewDto dto)
    {
        var review = await _context.ExemptedReviews.FindAsync(dto.ReviewId);
        if (review == null || review.CurrentStage != "Manager") return BadRequest();

        var data = new
        {
            Ratings = dto.Ratings,
            Signature = dto.Signature
        };

        review.SupervisorRatings = JsonConvert.SerializeObject(data);
        review.ManagerComplete = true;
        review.CurrentStage = "HR";

        _context.Notifications.Add(new Notification
        {
            UserId = "3174",
            Message = "A completed review is ready for HR processing.",
            Link = $"/review/exempted/{dto.ReviewId}"
        });

        await _context.SaveChangesAsync();
        return Ok();
    }


    [HttpGet("full/{id}")]
    public async Task<IActionResult> GetFullReview(Guid id)
    {
        var review = await _context.ExemptedReviews.FindAsync(id);
        if (review == null) return NotFound();

        dynamic employeeBlock = string.IsNullOrEmpty(review.EmployeeAnswers)
            ? null : JsonConvert.DeserializeObject(review.EmployeeAnswers);
        dynamic supervisorBlock = string.IsNullOrEmpty(review.SupervisorRatings)
            ? null : JsonConvert.DeserializeObject(review.SupervisorRatings);

       
        Dictionary<string, string> employeeAnswers = employeeBlock?.Answers?.ToObject<Dictionary<string, string>>() ;
        SignatureMeta employeeSig = employeeBlock?.Signature?.ToObject<SignatureMeta>();

        List<RatingDto> supervisorRatings = supervisorBlock?.Ratings?.ToObject<List<RatingDto>>() ;
        SignatureMeta supervisorSig = supervisorBlock?.Signature?.ToObject<SignatureMeta>();

        return Ok(new
        {
            employeeAnswers,
            employeeSignature = employeeSig,
            supervisorRatings,
            supervisorSignature = supervisorSig,
            summary = string.IsNullOrEmpty(review.Summary)
                ? null : JsonConvert.DeserializeObject<SummaryDto>(review.Summary)
        });
    }



    [HttpPost("finalize")]
    public async Task<IActionResult> FinalizeReview([FromBody] FinalizeReviewDto dto)
    {
        var review = await _context.ExemptedReviews.FindAsync(dto.ReviewId);
        if (review == null || review.CurrentStage != "HR") return BadRequest();

        review.CurrentStage = "Closed";
        review.ManagerComplete = true; // Optional

        await _context.SaveChangesAsync();
        return Ok();
    }


    [HttpPost("submit-hr")]
    public async Task<IActionResult> SubmitHRReview(HRReviewDto dto)
    {
        var review = await _context.ExemptedReviews.FindAsync(dto.ReviewId);
        if (review == null || review.CurrentStage != "HR") return BadRequest();

        review.Summary = JsonConvert.SerializeObject(dto.Summary);
        review.CurrentStage = "Complete";

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("pdf/{reviewId}")]
    public async Task<IActionResult> GetReviewPdf(Guid reviewId)
    {
        var review = await _context.ExemptedReviews.FindAsync(reviewId);
        if (review == null) return NotFound();

    

        byte[] pdfBytes = _pdfServices.GenerateReviewPdf(review); 

        return File(pdfBytes, "application/pdf", "ExemptedReview.pdf");
    }

}

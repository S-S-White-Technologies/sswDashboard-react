using Intuit.Ipp.Data;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services.Interfaces;
using sswDashboardAPI.Services;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Models;

public class ExemptedReviewService : IExemptedReviewService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public ExemptedReviewService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<IEnumerable<EligibleEmployeeDto>> GetEligibleEmployeesAsync()
    {
        var oneYearAgo = DateTime.UtcNow.Date.AddYears(-1);
        var reviewedEmpIds = await _context.ExemptedReviews.Select(r => r.EmpId).ToListAsync();

        var eligible = await (
            from emp in _context.EmpBasic
            join job in _context.Employees on emp.EmpID equals job.EmpId
            where emp.EmpStatus == "A" && job.HireDate.Date == oneYearAgo && !reviewedEmpIds.Contains(emp.EmpID)
            select new EligibleEmployeeDto
            {
                EmpId = emp.EmpID,
                FullName = emp.FirstName + " " + emp.LastName,
                Email = job.EmailAddress,
                HireDate = job.HireDate,
                SupervisorId = emp.SupervisorID
            }
        ).ToListAsync();

        return eligible;
    }

    public async Task<bool> StartReviewAsync(StartReviewDto dto)
    {
        var employee = await _context.EmpBasic.FirstOrDefaultAsync(e => e.EmpID == dto.EmpId);
        var jobInfo = await _context.Employees.FirstOrDefaultAsync(e => e.EmpId == dto.EmpId);

        if (employee == null || jobInfo == null)
            return false;

        var review = new ExemptedReview
        {
            ReviewId = Guid.NewGuid(),
            EmpId = dto.EmpId,
            SupervisorId = employee.SupervisorID,
            CurrentStage = "Employee",
            StartedAt = DateTime.UtcNow,
            NotifiedEmployeeAt = DateTime.UtcNow,
            EmployeeComplete = false,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.UtcNow
        };

        _context.ExemptedReviews.Add(review);
        await _context.SaveChangesAsync();

        await _emailService.SendEmailAsync(new EmailMessages
        {
            To = jobInfo.EmailAddress,
            Subject = "Your Exempted Review Form",
            Body = $"Dear {employee.FirstName},<br><br>You have a pending exempted review form. Please complete your section as soon as possible.<br><br>Thanks,<br>HR Team"
        });

        _context.Notifications.Add(new Notification
        {
            UserId = dto.EmpId,
            Message = "You have been assigned a new Exempted Review form.",
            Link = $"/review/exempted/{review.ReviewId}"
            //CreatedAt = DateTime.UtcNow (optional)
        });

        await _context.SaveChangesAsync();
        return true;
    }
}

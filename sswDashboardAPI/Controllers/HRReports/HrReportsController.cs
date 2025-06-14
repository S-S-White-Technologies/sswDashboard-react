// EF Core model
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model.HrReports;







// API Controller
[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;
   

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    


    [HttpGet("daily-report")]
    public async Task<IActionResult> GetDailyReport([FromQuery] string? empId = null, [FromQuery] DateTime? reportDate = null)
    {
        var targetDate = reportDate ?? DateTime.Today;
        var startOfDay = targetDate.Date;
        var endOfDay = targetDate.Date.AddDays(1).AddTicks(-1);

        var query = _context.TimeClock
            .Where(t => t.ReportDate >= startOfDay && t.ReportDate <= endOfDay && (t.Approval == null || !t.Approval.Contains("PENDING")));

        if (!string.IsNullOrEmpty(empId))
        {
            query = query.Where(t => t.EmpId == empId);
        }

        var timeClockData = await query
            .OrderBy(t => t.EmpId).ThenBy(t => t.ReportDate).ThenBy(t => t.ClockTime)
            .Select(t => new
            {
                t.EmpId,
                t.ClockTime,
                t.Status,
                t.ClockType,
                t.ReportDate
            }).ToListAsync();

        var reportedEmpIds = timeClockData.Select(t => t.EmpId.Trim()).Distinct().ToList();

        var allEmpBasics = await _context.EmpBasic
            .Where(e => e.EmpStatus == "A")
            .Select(e => new
            {
                e.EmpID,
                FullName = (e.FirstName + " " + e.LastName).ToUpper()
            }).ToListAsync();

        var merged = new List<dynamic>();

        var groupedResult = timeClockData
    .GroupBy(e => e.EmpId)
    .Select(group =>
    {
        var empId = group.Key;
        var fullName = allEmpBasics.FirstOrDefault(x => x.EmpID == empId)?.FullName ?? empId;
        var records = group.OrderBy(x => x.ClockTime).ToList();

        var recordList = new List<object>();
        double totalMinutes = 0;

        for (int i = 0; i < records.Count; i++)
        {
            var current = records[i];
            var next = (i + 1 < records.Count) ? records[i + 1] : null;

            double workedMinutes = 0;

            if (current.Status == "IN" && next != null && next.Status == "OUT")
            {
                workedMinutes = (next.ClockTime - current.ClockTime).TotalMinutes;
                totalMinutes += workedMinutes;

                Console.WriteLine($"IN at {current.ClockTime}, OUT at {next.ClockTime} = {workedMinutes} minutes");
            }

            recordList.Add(new
            {
                DayOfWeek = current.ReportDate.DayOfWeek.ToString().Substring(0, 3).ToUpper(),
                Date = current.ReportDate.Date,
                Status = current.Status,
                Time = current.ClockTime,
                Type = current.ClockType,
                WorkingTime = Math.Round(workedMinutes, 2),
                DateString = current.ReportDate.ToShortDateString()
            });
        }


        return new
        {
            EmpId = empId,
            Name = fullName,
            Records = recordList,
            TotalWorkingTime = TimeSpan.FromMinutes(totalMinutes).ToString(@"hh\:mm")
        };
    }).ToList();






        if (string.IsNullOrEmpty(empId))
        {
            var absentEmps = allEmpBasics.Where(e => !reportedEmpIds.Contains(e.EmpID)).ToList();
            foreach (var emp in absentEmps)
            {
                merged.Add(new
                {
                    Name = emp.FullName,
                    Flag = "",
                    DayOfWeek = targetDate.DayOfWeek.ToString().Substring(0, 3).ToUpper(),
                    Date = targetDate.Date,
                    Status = "****ABSENT****",
                    Time = "",
                    Type = "",
                    WorkingTime = 0,
                    DateString = targetDate.ToShortDateString()
                });
            }
        }

        return Ok(groupedResult);
    }

    [HttpGet("early-leave-report")]
    public async Task<IActionResult> GetEarlyLeaveReport(
    [FromQuery] DateTime startDate,
    [FromQuery] DateTime endDate,
    [FromQuery] string? empId = null)
    {
        var rawData = await _context.TimeClock
            .Where(t =>
                t.ClockTime >= startDate &&
                t.ClockTime <= endDate &&
                t.Status == "OUT" &&
                t.ClockType == "Normal" &&
                (t.Approval == null || !t.Approval.Contains("PENDING")))
            .ToListAsync();

        // In-memory time filter
        var filtered = rawData
            .Where(t => t.ClockTime.TimeOfDay < new TimeSpan(16, 30, 0))
            .ToList();

        if (!string.IsNullOrWhiteSpace(empId))
        {
            filtered = filtered.Where(t => t.EmpId == empId).ToList();
        }

        var empIds = filtered.Select(x => x.EmpId.Trim()).Distinct().ToList();

        var empNames = await _context.EmpBasic
            .Where(e => e.EmpStatus == "A" && empIds.Contains(e.EmpID))
            .Select(e => new
            {
                e.EmpID,
                FullName = (e.FirstName + " " + e.LastName).ToUpper()
            }).ToListAsync();

        var result = filtered
            .OrderBy(x => x.EmpId).ThenBy(x => x.ReportDate).ThenBy(x => x.ClockTime)
            .Select(x => new
            {
                EmpId = x.EmpId,
                Name = empNames.FirstOrDefault(e => e.EmpID == x.EmpId)?.FullName ?? x.EmpId,
                Flag = "",
                DayOfWeek = x.ReportDate.DayOfWeek.ToString().Substring(0, 3).ToUpper(),
                Date = x.ReportDate.Date,
                Status = x.Status,
                Time = x.ClockTime,
                TimeString = x.ClockTime.ToString("hh:mm tt"),
                Type = x.ClockType,
                WorkingTime = 0,
                DateString = x.ReportDate.ToShortDateString()
            }).ToList();

        return Ok(new { Count = result.Count, Records = result });
    }



}


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model.HrReports;

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
    public async Task<IActionResult> GetDailyReport(
      [FromQuery] List<string>? empIds = null,
      [FromQuery] List<string>? employeeNames = null,
      [FromQuery] List<string>? departmentIds = null,
      [FromQuery] DateTime? reportDate = null)
    {
        var targetDate = reportDate ?? DateTime.Today;
        var startOfDay = targetDate.Date;
        var endOfDay = targetDate.Date.AddDays(1).AddTicks(-1);

        var allEmpBasics = await _context.EmpBasic
            .Where(e => e.EmpStatus == "A")
            .Select(e => new
            {
                e.EmpID,
                FullName = (e.FirstName + " " + e.LastName).ToUpper(),
                DeptId = e.JCDept.ToString()
            }).ToListAsync();

        
        var filteredEmpIds = allEmpBasics
            .Where(e =>
                (employeeNames == null || employeeNames.Contains(e.FullName)) &&
                (departmentIds == null || departmentIds.Contains(e.DeptId)))
            .Select(e => e.EmpID)
            .ToList();

        var finalEmpIds = empIds ?? new List<string>();
        finalEmpIds.AddRange(filteredEmpIds);
        finalEmpIds = finalEmpIds.Distinct().ToList();

        
        var query = _context.TimeClock
            .Where(t =>
                t.ReportDate >= startOfDay &&
                t.ReportDate <= endOfDay &&
                (t.Approval == null || !t.Approval.Contains("PENDING")));

        if (finalEmpIds.Any())
        {
            query = query.Where(t => finalEmpIds.Contains(t.EmpId));
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

        
        var merged = new List<dynamic>();
        if (!empIds?.Any() == true && !employeeNames?.Any() == true && !departmentIds?.Any() == true)
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


    [HttpGet("daily-report-hourly")]
    public async Task<IActionResult> GetDailyReportHourly(
      [FromQuery] List<string>? empIds = null,
      [FromQuery] List<string>? employeeNames = null,
      [FromQuery] List<string>? departmentIds = null,
      [FromQuery] DateTime? reportDate = null)
    {
        var targetDate = reportDate ?? DateTime.Today;
        var startOfDay = targetDate.Date;
        var endOfDay = targetDate.Date.AddDays(1).AddTicks(-1);

        
        var allEmpBasics = await _context.EmpBasic
            .Where(e => e.EmpStatus == "A")
            .Select(e => new
            {
                e.EmpID,
                FullName = (e.FirstName + " " + e.LastName).ToUpper(),
                DeptId = e.JCDept.ToString()
            }).ToListAsync();

       
        var filteredEmpIds = allEmpBasics
            .Where(e =>
                (employeeNames == null || employeeNames.Contains(e.FullName)) &&
                (departmentIds == null || departmentIds.Contains(e.DeptId)))
            .Select(e => e.EmpID)
            .ToList();

        
        var finalEmpIds = empIds ?? new List<string>();
        finalEmpIds.AddRange(filteredEmpIds);
        finalEmpIds = finalEmpIds.Distinct().ToList();

       
        var query = _context.TimeClockFactory
            .Where(t =>
                t.ReportDate >= startOfDay &&
                t.ReportDate <= endOfDay &&
                (t.Approval == null || !t.Approval.Contains("PENDING")));

        if (finalEmpIds.Any())
        {
            query = query.Where(t => finalEmpIds.Contains(t.EmpId));
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

        
        var merged = new List<dynamic>();
        if (!empIds?.Any() == true && !employeeNames?.Any() == true && !departmentIds?.Any() == true)
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
     [FromQuery] List<string>? empIds = null,
     [FromQuery] string? departmentId = null,
     [FromQuery] List<string>? employeeNames = null)
    {
        var rawData = await _context.TimeClock
            .Where(t =>
                t.ClockTime >= startDate &&
                t.ClockTime <= endDate &&
                t.Status == "OUT" &&
                t.ClockType == "Normal" &&
                (t.Approval == null || !t.Approval.Contains("PENDING")))
            .ToListAsync();

       
        var filtered = rawData
            .Where(t => t.ClockTime.TimeOfDay < new TimeSpan(16, 30, 0))
            .ToList();

        if (empIds != null && empIds.Any())
        {
            filtered = filtered.Where(t => empIds.Contains(t.EmpId)).ToList();
        }

        var empIdsUsed = filtered.Select(x => x.EmpId.Trim()).Distinct().ToList();

        var empQuery = _context.EmpBasic.AsQueryable();

        empQuery = empQuery.Where(e => e.EmpStatus == "A");

        if (!string.IsNullOrWhiteSpace(departmentId))
        {
            empQuery = empQuery.Where(e => e.JCDept == departmentId);
        }

        if (employeeNames != null && employeeNames.Any())
        {
            var lowerNames = employeeNames.Select(n => n.ToLower()).ToList();
            empQuery = empQuery.Where(e => lowerNames.Contains((e.FirstName + " " + e.LastName).ToLower()));
        }

        if (empIdsUsed.Any())
        {
            empQuery = empQuery.Where(e => empIdsUsed.Contains(e.EmpID));
        }

        var empNames = await empQuery
            .Select(e => new
            {
                e.EmpID,
                FullName = (e.FirstName + " " + e.LastName).ToUpper(),
                e.JCDept
            })
            .ToListAsync();

        var result = filtered
            .Where(x => empNames.Any(e => e.EmpID == x.EmpId))
            .OrderBy(x => x.EmpId).ThenBy(x => x.ReportDate).ThenBy(x => x.ClockTime)
            .Select(x =>
            {
                var empInfo = empNames.FirstOrDefault(e => e.EmpID == x.EmpId);
                return new
                {
                    EmpId = x.EmpId,
                    Name = empInfo?.FullName ?? x.EmpId,
                    DepartmentId = empInfo?.JCDept ?? "",
                    Flag = "",
                    DayOfWeek = x.ReportDate.DayOfWeek.ToString().Substring(0, 3).ToUpper(),
                    Date = x.ReportDate.Date,
                    Status = x.Status,
                    Time = x.ClockTime,
                    TimeString = x.ClockTime.ToString("hh:mm tt"),
                    Type = x.ClockType,
                    WorkingTime = 0,
                    DateString = x.ReportDate.ToShortDateString()
                };
            })
            .ToList();

        return Ok(new { Count = result.Count, Records = result });
    }




    [HttpGet("early-leave-report-hourly")]
    public async Task<IActionResult> GetEarlyLeaveReportHourly(
     [FromQuery] DateTime startDate,
     [FromQuery] DateTime endDate,
     [FromQuery] List<string>? empIds = null,
     [FromQuery] string? departmentId = null,
     [FromQuery] List<string>? employeeNames = null)
    {
        var rawData = await _context.TimeClockFactory
            .Where(t =>
                t.ClockTime >= startDate &&
                t.ClockTime <= endDate &&
                t.Status == "OUT" &&
                t.ClockType == "Normal" &&
                (t.Approval == null || !t.Approval.Contains("PENDING")))
            .ToListAsync();

       
        var filtered = rawData
            .Where(t => t.ClockTime.TimeOfDay < new TimeSpan(16, 30, 0))
            .ToList();

        if (empIds != null && empIds.Any())
        {
            filtered = filtered.Where(t => empIds.Contains(t.EmpId)).ToList();
        }

        var empIdsUsed = filtered.Select(x => x.EmpId.Trim()).Distinct().ToList();

        var empQuery = _context.EmpBasic.AsQueryable();

        empQuery = empQuery.Where(e => e.EmpStatus == "A");

        if (!string.IsNullOrWhiteSpace(departmentId))
        {
            empQuery = empQuery.Where(e => e.JCDept == departmentId);
        }

        if (employeeNames != null && employeeNames.Any())
        {
            var lowerNames = employeeNames.Select(n => n.ToLower()).ToList();
            empQuery = empQuery.Where(e => lowerNames.Contains((e.FirstName + " " + e.LastName).ToLower()));
        }

        if (empIdsUsed.Any())
        {
            empQuery = empQuery.Where(e => empIdsUsed.Contains(e.EmpID));
        }

        var empNames = await empQuery
            .Select(e => new
            {
                e.EmpID,
                FullName = (e.FirstName + " " + e.LastName).ToUpper(),
                e.JCDept
            })
            .ToListAsync();

        var result = filtered
            .Where(x => empNames.Any(e => e.EmpID == x.EmpId))
            .OrderBy(x => x.EmpId).ThenBy(x => x.ReportDate).ThenBy(x => x.ClockTime)
            .Select(x =>
            {
                var empInfo = empNames.FirstOrDefault(e => e.EmpID == x.EmpId);
                return new
                {
                    EmpId = x.EmpId,
                    Name = empInfo?.FullName ?? x.EmpId,
                    DepartmentId = empInfo?.JCDept ?? "",
                    Flag = "",
                    DayOfWeek = x.ReportDate.DayOfWeek.ToString().Substring(0, 3).ToUpper(),
                    Date = x.ReportDate.Date,
                    Status = x.Status,
                    Time = x.ClockTime,
                    TimeString = x.ClockTime.ToString("hh:mm tt"),
                    Type = x.ClockType,
                    WorkingTime = 0,
                    DateString = x.ReportDate.ToShortDateString()
                };
            })
            .ToList();

        return Ok(new { Count = result.Count, Records = result });
    }

}

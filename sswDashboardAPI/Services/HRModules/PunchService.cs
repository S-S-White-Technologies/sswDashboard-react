using Intuit.Ipp.Data;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model.HrReports;

namespace sswDashboardAPI.Services.HRModules
{
    public class PunchService
    {
        private readonly AppDbContext _context;

        public PunchService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PunchReportDTO> GetMissingPunchesAsync(DateTime startDate, DateTime endDate)
        {
            var punches = await _context.TimeClock
                .Where(tc => tc.ReportDate >= startDate && tc.ReportDate <= endDate)
                .ToListAsync();

            var empIds = punches.Select(p => p.EmpId).Distinct();
            var missingPunches = new List<MissingPunchDTO>();

            var empBasic = await _context.EmpBasic
    .Select(e => new { e.EmpID, e.Name })  
    .ToListAsync();

            var seqCode = await _context.TimeClock
    .Select(e => new { e.EmpId, e.Id })
    .ToListAsync();

            foreach (var empId in empIds)
            {
                for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
                {
                    var empPunches = punches
                        .Where(p => p.EmpId == empId && p.ReportDate.Date == date && p.Approval?.ToUpper() != "PENDING APPROVAL")
                        .ToList();
                    var empName = empBasic.FirstOrDefault(e => e.EmpID == empId)?.Name ?? "Unknown";
                    var sequanceCode = seqCode.FirstOrDefault(e=> e.EmpId == empId).Id;
                    var inCount = empPunches.Count(p => p.Status?.ToUpper() == "IN");
                    var outCount = empPunches.Count(p => p.Status?.ToUpper() == "OUT");

                    if (inCount != outCount)
                    {
                        string type = inCount > outCount ? "Missing OUT" : "Missing IN";
                        missingPunches.Add(new MissingPunchDTO
                        {
                            EmpId = empId,
                            Name = empName,
                            SeqCode = sequanceCode,
                            Date = date,
                            Type = type
                        });
                    }
                }
            }

            var pendingApprovals = punches
                .Where(p => p.Approval?.ToUpper() == "PENDING APPROVAL")
                .Select(p => new PendingApprovalDTO
                {
                    EmpId = p.EmpId,
                    Date = p.ReportDate
                })
                .Distinct()
                .ToList();

            return new PunchReportDTO
            {
                MissingPunches = missingPunches,
                PendingApprovals = pendingApprovals
            };
        }
    }


}

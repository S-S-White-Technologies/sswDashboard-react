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
    .Select(e => new { e.EmpId, e.Id, e.ReportDate })
    .ToListAsync();

            foreach (var empId in empIds)
            {
                for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
                {
                    var empPunches = punches
    .Where(p => p.EmpId == empId && p.ReportDate.Date == date && p.Approval?.ToUpper() != "PENDING APPROVAL")
    .OrderBy(p => p.ClockTime)
    .ToList();

                    var empName = empBasic.FirstOrDefault(e => e.EmpID == empId)?.Name ?? "Unknown";
                    var inCount = empPunches.Count(p => p.Status?.Trim().ToUpper() == "IN");
                    var outCount = empPunches.Count(p => p.Status?.Trim().ToUpper() == "OUT");


                    var sequanceCode = seqCode
    .FirstOrDefault(e => e.EmpId == empId && e.ReportDate.Date == date)?.Id ?? 0;


                    if (inCount != outCount)
                    {
                        string type = inCount > outCount ? "Missing OUT" : "Missing IN";
                        int? seqCoder = null;

                        if (type == "Missing OUT")
                        {
                            seqCoder = empPunches
                                .Where(p => p.Status?.ToUpper() == "IN")
                                .Take(inCount - outCount)
                                .LastOrDefault()?.Id;
                        }
                        else // Missing IN
                        {
                            seqCoder = empPunches
                                .Where(p => p.Status?.ToUpper() == "OUT")
                                .Take(outCount - inCount)
                                .LastOrDefault()?.Id;
                        }

                        if (seqCoder.HasValue)
                        {
                            missingPunches.Add(new MissingPunchDTO
                            {
                                EmpId = empId,
                                Name = empName,
                                SeqCode = seqCoder.Value,
                                Date = date,
                                Type = type
                            });
                        }
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

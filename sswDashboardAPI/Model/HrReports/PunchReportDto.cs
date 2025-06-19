namespace sswDashboardAPI.Model.HrReports
{
    public class PunchReportDTO
    {
        public List<MissingPunchDTO> MissingPunches { get; set; }
        public List<PendingApprovalDTO> PendingApprovals { get; set; }
    }
}

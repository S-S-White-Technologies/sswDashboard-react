namespace sswDashboardAPI.Model.HrReports
{
    public class MissingPunchDTO
    {
        public string EmpId { get; set; }
        public string Name { get; set; }
        public int SeqCode { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }
    }
}

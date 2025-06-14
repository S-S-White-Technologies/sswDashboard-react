namespace sswDashboardAPI.Model.HrReports
{
    public class ReportRow
    {
        public string Name { get; set; }
        public string Flag { get; set; }
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; }
        public string Status { get; set; }
        public string Time { get; set; }
        public string Type { get; set; }
        public decimal WorkingTime { get; set; }
        public string DateString { get; set; }
    }

}

namespace sswDashboardAPI.Model.Time_and_Attendance
{
    public class TimeClockEntry
    {
        public string EmpId { get; set; }
        public string ClockType { get; set; }
        public string Status { get; set; }
        public DateTime? ClockTime { get; set; }
    }

}

namespace sswDashboardAPI.Model
{
    public class WorkTime
    {
        public string EmpId { get; set; }
        public DateTime? ClockInTime { get; set; }
        public DateTime? ClockOutTime { get; set; }
        public DateTime? BreakStartTime { get; set; }
        public DateTime? BreakEndTime { get; set; }
    }


}

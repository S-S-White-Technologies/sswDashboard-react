namespace sswDashboardAPI.Model
{
    public class WorkTime
    {
        public string EmpId { get; set; }
        public DateTime? ClockInTime { get; set; }
        public DateTime? ClockOutTime { get; set; }
        public DateTime? BreakStartTime { get; set; }
        public DateTime? BreakEndTime { get; set; }
        public DateTime? BusinessStartTime { get; set; }
        public DateTime? BusinessEndTime { get; set; }

        public DateTime? PersonalStartTime { get; set; }
        public DateTime? PersonalEndTime { get; set; }
    }


}

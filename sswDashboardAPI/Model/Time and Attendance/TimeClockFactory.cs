using System.ComponentModel.DataAnnotations;

namespace sswDashboardAPI.Model.Time_and_Attendance
{
    public class TimeClockFactory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string EmpId { get; set; }

       

        public string Status { get; set; }

        public DateTime? BackTime { get; set; }

        public string ClockType { get; set; }

        public DateTime ClockTime { get; set; }

        public string Approval { get; set; }
    }
}

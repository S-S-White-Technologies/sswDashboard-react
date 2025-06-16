public class TimeClock
{
    public int Id { get; set; } // Primary key

    public DateTime ClockTime { get; set; }
    public string ClockType { get; set; }
    public short WeekNumber { get; set; }
    public short Year { get; set; }

    public string EmpId { get; set; }
    public string Computer { get; set; }
    public string Status { get; set; }
    public DateTime ReportDate { get; set; }

    public string Approval {  get; set; }
    public bool ManualSelect { get; set; }
    public bool Remote { get; set; }

    // Add any other necessary fields or audit columns
}

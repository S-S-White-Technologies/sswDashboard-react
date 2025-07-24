namespace sswDashboardAPI.Model
{
    public class EligibleEmployeeDto
    {
        public string EmpId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime HireDate { get; set; }
        public string SupervisorId { get; set; }
    }

}

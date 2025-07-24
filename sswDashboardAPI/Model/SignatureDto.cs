namespace sswDashboardAPI.Model
{
    public class SignatureDto
    {
        public string Supervisor { get; set; }
        public DateTime? SupervisorDate { get; set; }
        public string DeptManager { get; set; }
        public DateTime? DeptManagerDate { get; set; }
        public string HR { get; set; }
        public DateTime? HRDate { get; set; }
    }
}

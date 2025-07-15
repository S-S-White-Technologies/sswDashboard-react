namespace sswDashboardAPI.Model.DI
{
    public class DetermineCheckCountRequestDto
    {
        public double JobQuan { get; set; }
        public string DnaNum { get; set; }
        public string PartNum { get; set; }
        public int RevMajor { get; set; }
        public int RevMinor { get; set; }
    }

}

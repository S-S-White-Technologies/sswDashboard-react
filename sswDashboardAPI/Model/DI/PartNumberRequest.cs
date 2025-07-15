namespace sswDashboardAPI.Model.DI
{
    public class PartNumberRequest
    {
        public string JobNum {  get; set; }
        public int AssemblySeq { get; set; }
        public string JobType { get; set; }
        public string CountryCode { get; set; }
    }
}

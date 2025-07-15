namespace sswDashboardAPI.Model.DI
{
    public class OriginalQuantityRequestDto
    {
        public string JobNum { get; set; }
        public int WaveNumber { get; set; }
        public int Seq { get; set; }
        public string PartNum { get; set; }
        public int? Lot { get; set; }
    }
}


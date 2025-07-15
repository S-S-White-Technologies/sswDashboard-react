namespace sswDashboardAPI.Model.DI
{
    public class CountEntriesRequestDto
    {
        public string JobNum { get; set; }
        public string DnaNum { get; set; }
        public int RevMajor { get; set; }
        public int RevMinor { get; set; }
        public int WaveNumber { get; set; }
        public int Seq { get; set; }
        public string PartNum { get; set; }
        public int LotNum { get; set; }

        public double JobQuan { get; set; }
    }

}

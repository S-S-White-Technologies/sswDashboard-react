namespace sswDashboardAPI.Model.DI
{
    public class SaveInspectionEntriesRequestDto
    {
        public string JobNum { get; set; } = string.Empty;
        public string DnaNum { get; set; } = string.Empty;
        public int RevMajor { get; set; }
        public int RevMinor { get; set; }
        public int WaveNumber { get; set; }
        public int AssemblySeq { get; set; }
        public string PartNum { get; set; } = string.Empty;
        public int LotNum { get; set; }
        public short EnteredBy { get; set; }
        public string? Tool { get; set; }
        public Dictionary<string, string> Entries { get; set; } = new();
        public string? Comment { get; set; }

        public NonConformityDto? NonConformities { get; set; }
    }

    public class NonConformityDto
    {
        public List<int> CellNums { get; set; } = new();
        public string Classification { get; set; } = string.Empty;
        public bool Scrap { get; set; }
        public bool Leave { get; set; }
        public bool Dmr { get; set; }
    }


}

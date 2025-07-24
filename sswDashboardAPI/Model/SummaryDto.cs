namespace sswDashboardAPI.Model
{
    public class SummaryDto
    {
        public string Strengths { get; set; }
        public string Improvements { get; set; }
        public string Recommendations { get; set; }
        public string Goals { get; set; }
        public bool FollowUpRequested { get; set; }
        public DateTime? MeetingDate { get; set; }
        public SignatureDto Signatures { get; set; }


        public SignatureMeta Signature { get; set; }
    }
}

namespace sswDashboardAPI.Model
{
    public class EmployeeReviewDto
    {
        public Guid ReviewId { get; set; }

        // Rename from 'Answers' to 'Questions' to match your API usage
        public Dictionary<string, string> Questions { get; set; }
        public SignatureMeta Signature { get; set; }
        public string SubmittedBy { get; set; }
    }


}

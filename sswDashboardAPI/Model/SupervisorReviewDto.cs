namespace sswDashboardAPI.Model
{
    public class SupervisorReviewDto
    {
        public Guid ReviewId { get; set; }
        public List<RatingDto> Ratings { get; set; }
        public SignatureMeta Signature { get; set; }
        public string SubmittedBy { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace sswDashboardAPI.Model
{
    public class Notification
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Link { get; set; }
        public string? ReviewId { get; set; } // <- NEW!
    }


}

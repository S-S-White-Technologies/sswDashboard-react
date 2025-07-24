using System;
using System.ComponentModel.DataAnnotations;
namespace sswDashboardAPI.Model
{
  

    public class ExemptedReview
    {
        [Key]
        public Guid ReviewId { get; set; }

        public string EmpId { get; set; }
        public string SupervisorId { get; set; }

        public string CurrentStage { get; set; } = "Employee";

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? NotifiedEmployeeAt { get; set; }

        public bool EmployeeComplete { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }

        public string? EmployeeAnswers {  get; set; }

        public DateTime? NotifiedManagerAt { get; set; }

        public string? SupervisorRatings { get; set; }
        public bool ManagerComplete { get; set; } = false;
        public string? Summary { get; set; }

    }

}

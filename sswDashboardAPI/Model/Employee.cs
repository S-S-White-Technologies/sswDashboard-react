using System.ComponentModel.DataAnnotations;

public class Employee
{
    [Key]
    public string EmpId { get; set; }
    public string EmailAddress { get; set; }
    public string ProjectsPassword { get; set; }
    public string Title { get; set; }

    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }


}

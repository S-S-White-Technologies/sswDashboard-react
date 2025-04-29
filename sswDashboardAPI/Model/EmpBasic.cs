using System.ComponentModel.DataAnnotations;

namespace sswDashboardAPI.Model
{
    public class EmpBasic
    {
        [Key]
        public string EmpId { get; set; }
        public string Name { get; set; }
        public string SupervisorId { get; set; }
        public string EmpStatus { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; }

    }
}

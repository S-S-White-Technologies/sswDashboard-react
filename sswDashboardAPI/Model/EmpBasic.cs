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
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string expensecode { get; set; }
        public string Dept { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }

    }
}

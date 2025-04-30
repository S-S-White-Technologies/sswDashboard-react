using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public string JcDept { get; set; }
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role Role { get; set; }

    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sswDashboardAPI.Model
{
    public class JcDept
    {
        [Key]
        [Column("JCDept")]
        public string JCDept1 { get; set; }
        public string Description { get; set; }
        public string Company { get; set; }
    }
}

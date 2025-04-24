using System.ComponentModel.DataAnnotations;

namespace sswDashboardAPI.Model
{
    public class JcDept
    {
        [Key]
        public string Description { get; set; }
        public string Company { get; set; }
    }
}

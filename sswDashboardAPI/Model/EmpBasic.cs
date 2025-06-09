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
        public string company {  get; set; }
        public string dcduserid { get; set; }
        public string cnvempid {  get; set; }

        public string address { get; set; }         
        public string address2 { get; set; }        
        public string city { get; set; }            
        public string state { get; set; }           
        public string zip { get; set; }             
        public string country { get; set; }         
        public string phone { get; set; }           
        public string emgContact { get; set; }
        public string middleinitial { get; set; }
        [ForeignKey("RoleId")]
        public Role Role { get; set; }

       

    }
}

﻿using System.ComponentModel.DataAnnotations;

namespace sswDashboardAPI.Model
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; } 
        public string RoleName { get; set; }

        //public ICollection<EmpBasic> EmpBasic { get; set; }  
    }

}

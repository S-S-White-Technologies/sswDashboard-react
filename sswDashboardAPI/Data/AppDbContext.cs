using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Model;
using System.Collections.Generic;

namespace sswDashboardAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<EmpBasic> EmpBasic { get; set; }
        
        public DbSet<Employee> Employees { get; set; }

        public DbSet<Role> Roles { get; set; }

    }
}

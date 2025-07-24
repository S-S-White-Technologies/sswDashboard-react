using Microsoft.EntityFrameworkCore;

using sswDashboardAPI.Model;

namespace sswDashboardAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmpBasic>()
                .HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey(e => e.RoleId);
            modelBuilder.Entity<EmpBasic>()
        .HasOne(e => e.Employees)
        .WithOne(e => e.EmpBasic)
        .HasForeignKey<Employee>(e => e.EmpId);
            base.OnModelCreating(modelBuilder);

        }

        public DbSet<EmpBasic> EmpBasic { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<TimeClock> TimeClock { get; set; }
        public DbSet<TimeClockFactory> TimeClockFactory { get; set; }

        public DbSet<ExemptedReview> ExemptedReviews { get; set; }

        public DbSet<Notification> Notifications { get; set; }


    }
}






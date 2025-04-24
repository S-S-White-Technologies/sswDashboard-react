using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Model;

namespace sswDashboardAPI.Data
{
    public class EpicorERPContext : DbContext
    {
        public EpicorERPContext(DbContextOptions<EpicorERPContext> options) : base(options) { }

        public DbSet<JcDept> JcDept { get; set; }

    }
}

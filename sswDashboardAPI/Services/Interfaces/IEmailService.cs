using System.Threading.Tasks;
using sswDashboardAPI.Models;

namespace sswDashboardAPI.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailMessages message);
    }
}

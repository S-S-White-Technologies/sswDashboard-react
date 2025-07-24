using sswDashboardAPI.Model;

namespace sswDashboardAPI.Services
{
    public interface IExemptedReviewService
    {
        Task<IEnumerable<EligibleEmployeeDto>> GetEligibleEmployeesAsync();
        Task<bool> StartReviewAsync(StartReviewDto dto);
    }
}

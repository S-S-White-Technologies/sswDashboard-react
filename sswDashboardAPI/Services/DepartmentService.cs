using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace sswDashboardAPI.Services
{
    public class DepartmentService
    {
        private readonly HttpClient _client;
        private readonly string _baseUrl = "https://gccdtpilot14.epicorsaas.com/saas1143pilot/api/v1/Erp.BO.JCDeptSvc";

        public DepartmentService(IHttpClientFactory httpClientFactory)
        {
            _client = httpClientFactory.CreateClient();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", "U2h1a2xhV2ViQXBwOkJaRFpwRzdUQWpHMUxpJVlaTXZX");
            _client.DefaultRequestHeaders.Add("License", "{\"ClaimedLicense\": \"00000003-079B-4C49-9D0A-EF8236247504\"}");
        }

        public async Task<HttpResponseMessage> GetDepartmentsAsync()
        {
            return await _client.GetAsync($"{_baseUrl}/JCDepts");
        }


        public async Task<HttpResponseMessage> AddDepartmentAsync(object dept)
        {
            try
            {
                // Serialize the payload to JSON
                var json = JsonConvert.SerializeObject(dept);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Send the POST request to Epicor API
                var response = await _client.PostAsync($"{_baseUrl}/JCDepts", content);

                // Check if the response is successful
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("✅ Department successfully added.");
                }
                else
                {
                    // If not successful, log the error and return the response
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"❌ Error adding department: {errorContent}");
                }

                return response; // Return the response to the controller
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Exception in AddDepartmentAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<HttpResponseMessage> DeleteDepartmentAsync(string company, string jcDept1)
        {
            try
            {
                var deleteUrl = $"{_baseUrl}/JCDepts({company},{jcDept1})";
                return await _client.DeleteAsync(deleteUrl);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Exception in DeleteDepartmentAsync: {ex.Message}");
                throw;
            }
        }




    }


}

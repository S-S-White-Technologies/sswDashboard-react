using Microsoft.AspNetCore.Mvc;
using sswDashboardAPI.Services;
using sswDashboardAPI.Model;
using Newtonsoft.Json;

namespace sswDashboardAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentService _departmentService;

        public DepartmentController(DepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        // ✅ GET: Returns department list from Epicor
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var httpResponse = await _departmentService.GetDepartmentsAsync();
            var resultString = await httpResponse.Content.ReadAsStringAsync();
            var parsed = JsonConvert.DeserializeObject<JcDeptResponse>(resultString);
            return Ok(parsed);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] JcDept jc)
        {
            if (jc == null || string.IsNullOrWhiteSpace(jc.JCDept1))
            {
                return BadRequest("Invalid input model");
            }

            // Log the incoming request for debugging
            Console.WriteLine($"Received department: {JsonConvert.SerializeObject(jc)}");

            var epicorPayload = new
            {
                Company = jc.Company,
                JCDept1 = jc.JCDept1,
                Description = jc.Description,
                GlobalJCDept = true,
                GlobalLock = true,
                BitFlag = 0,
                RowMod = "A"
            };

            // Call the service to add the department to Epicor
            var response = await _departmentService.AddDepartmentAsync(epicorPayload);

            // If the department was successfully added, re-fetch and return the departments list
            if (response.IsSuccessStatusCode)
            {
                var result = await _departmentService.GetDepartmentsAsync();
                var stringContent = await result.Content.ReadAsStringAsync();
                var json = JsonConvert.DeserializeObject<object>(stringContent);
                return Ok(json);  // Send back the updated list to the frontend
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"❌ Error from Epicor: {error}");
                return StatusCode((int)response.StatusCode, error);
            }
        }


        [HttpDelete("{company}/{jcDept1}")]
        public async Task<IActionResult> Delete(string company, string jcDept1)
        {
            if (string.IsNullOrWhiteSpace(company) || string.IsNullOrWhiteSpace(jcDept1))
                return BadRequest("Invalid department info.");

            var response = await _departmentService.DeleteDepartmentAsync(company, jcDept1);

            if (response.IsSuccessStatusCode)
            {
                return Ok("Department deleted successfully.");
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"❌ Delete error: {error}");
                return StatusCode((int)response.StatusCode, error);
            }
        }





    }
}

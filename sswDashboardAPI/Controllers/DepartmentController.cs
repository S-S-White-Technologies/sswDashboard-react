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

           
            var response = await _departmentService.AddDepartmentAsync(epicorPayload);

          
            if (response.IsSuccessStatusCode)
            {
                var result = await _departmentService.GetDepartmentsAsync();
                var stringContent = await result.Content.ReadAsStringAsync();
                var json = JsonConvert.DeserializeObject<object>(stringContent);
                return Ok(json);  
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

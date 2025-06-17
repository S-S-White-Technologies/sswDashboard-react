using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using sswDashboardAPI.Model;
using sswDashboardAPI.Services;


namespace sswDashboardAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]


    public class RoleController : ControllerBase
    {
        private readonly RoleService _service;
        public RoleController(RoleService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.GetRolesAsync());

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Role role)
        {
            try
            {
                Console.WriteLine("📥 Incoming Role JSON: " + JsonConvert.SerializeObject(role));
                if (string.IsNullOrWhiteSpace(role.RoleName))
                    return BadRequest("RoleName is required");

                await _service.AddRoleAsync(role);
                Console.WriteLine("✅ Role added.");
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error adding role: " + ex.Message);
                Console.WriteLine("📄 Stack trace: " + ex.StackTrace);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteRoleAsync(id);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Role role)
        {
            await _service.UpdateRoleAsync(role);
            return Ok();
        }
    }
}

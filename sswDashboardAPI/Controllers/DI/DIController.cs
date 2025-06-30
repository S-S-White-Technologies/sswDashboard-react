using System;
using System.Net.Http.Headers;
using System.Text;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Security.Principal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Model.DI;
using sswDashboardAPI.Services;
using Newtonsoft.Json.Linq;
using Microsoft.Data.SqlClient;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;


namespace sswDashboardAPI.Controllers.DI
{
    [Route("api/[controller]")]
    [ApiController]
    public class DIController : ControllerBase
    {
        private readonly string KineticConnectionString;
        private readonly string PlutoConnectionString;

        public DIController(IConfiguration configuration, AppDbContext context)
        {
            KineticConnectionString = configuration.GetConnectionString("KineticConnection");
            PlutoConnectionString = configuration.GetConnectionString("PlutoConnection");
        }

        [HttpGet("getcountrycode")]
        public async Task<IActionResult> GetCountryCode()
        {
            string country = "";
            var identity = HttpContext.User.Identity;
            string domainUser = identity?.Name ?? ""; // e.g., "SSWHITE-INDIA\\username"

            if (domainUser.ToLower().Contains("sswhite-india"))
            {
                country = "INDIA";
            }
            else
            {
                // Fallback: Use IP Address logic
                var ip = HttpContext.Connection.RemoteIpAddress;
                if (ip != null && ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    string ipString = ip.ToString();
                    if (ipString.StartsWith("10."))
                    {
                        country = "UK";
                    }
                }

                if (string.IsNullOrEmpty(country))
                {
                    country = "USA";
                }
            }

            return Ok($"{ country }");
        }

        [HttpPost("get-assembly-number")]
        public async Task<IActionResult> GetAssembly([FromBody] JobAsmblDto jobdto)
        {
            string cc="SSW";
            if(jobdto.countrycode=="INDIA")
            {
                cc = "SN";
            }
            string selectStatement = "SELECT AssemblySeq FROM [SaaS1143_62653].[Erp].JobAsmbl WHERE Jobnum=@jobnum AND Company=@co;";
            var assemblyList = new List<int>();

            using (var conn = new SqlConnection(KineticConnectionString))
            using (var selectCommand = new SqlCommand(selectStatement, conn))
            {
                selectCommand.Parameters.AddWithValue("@jobnum", jobdto.jobNum);
                selectCommand.Parameters.AddWithValue("@co", cc);

                try
                {
                    await conn.OpenAsync();
                    using (var reader = await selectCommand.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            if (!reader.IsDBNull(0))
                                assemblyList.Add(reader.GetInt32(0)); // assuming AssemblySeq is int
                        }
                    }

                    if (assemblyList.Count == 0 || assemblyList.Count == 1)
                        return Ok(assemblyList.First());

                    return Ok(assemblyList); // returns as a JSON array
                }
                catch (Exception ex)
                {
                    return StatusCode(400, "Some Error Happened");
                }
            }
            return Ok();
        }
        
        [HttpPost("get-part-wchildren-for-job")]
        public async Task<IActionResult> GetPartWChildren([FromBody] JobAsmblDto jobdto)
        {
                string cc = "SSW";
                if (jobdto.countrycode == "INDIA")
                {
                    cc = "SN";
                }
                string selectStatement1 = "SELECT PartNum FROM [SaaS1143_62653].[Erp].JobAsmbl WHERE jobnum=@jobnum AND Assemblyseq=@seq  AND Company=@co;";

                using (var conn = new SqlConnection(KineticConnectionString))
                using (var selectCommand = new SqlCommand(selectStatement1, conn))
                {
                    selectCommand.Parameters.AddWithValue("@jobnum", jobdto.jobNum);
                    selectCommand.Parameters.AddWithValue("@seq", jobdto.assemblySeq);
                    selectCommand.Parameters.AddWithValue("@co", cc);

                        try
                        {
                            await conn.OpenAsync();
                            var value = await selectCommand.ExecuteScalarAsync();

                            if (value == null || value == DBNull.Value)
                                return Ok("No part number found");
                            var childParts = new List<string>();
                            childParts.Add(value.ToString());
                            childParts.AddRange(getchildparts(value.ToString())); 

                    return Ok(childParts);
                        }
                        catch (Exception ex)
                        {
                            return StatusCode(400, "Some Error Happened");
                        }
                    }
                return Ok();
        }

        [HttpPost("get-part-wchildren-for-po-line")]
        public async Task<IActionResult> GetPartWChildrenForPOLine([FromBody] PODetailDto podto)
        {
            string cc = "SSW";
            if (podto.countrycode == "INDIA")
            {
                cc = "SN";
            }
            string selectStatement1 = "SELECT PartNum FROM [SaaS1143_62653].[Erp].podetail WHERE poNum=@poNum and POLine=@poLine  AND Company=@co;";


            using (var conn = new SqlConnection(KineticConnectionString))
            using (var selectCommand = new SqlCommand(selectStatement1, conn))
            {
                selectCommand.Parameters.AddWithValue("@poNum", podto.PONum);
                selectCommand.Parameters.AddWithValue("@poLine", podto.POLine);
                selectCommand.Parameters.AddWithValue("@co", cc);

                try
                {
                    await conn.OpenAsync();
                    var value = await selectCommand.ExecuteScalarAsync();

                    if (value == null || value == DBNull.Value)
                        return Ok("No Part Number Found");

                    var childParts = new List<string>();
                    childParts.Add(value.ToString());
                    //childParts.AddRange(getchildparts(value.ToString()));

                    return Ok(childParts);


                    //string selectStatement2 = "SELECT ChildPart FROM MafiaChildren WHERE ParentPart=@ParentPart";
                    //var childParts = new List<string>();
                    //childParts.Add(value.ToString());

                    //using (var conn2 = new SqlConnection(PlutoConnectionString))
                    //using (var selectCommand2 = new SqlCommand(selectStatement2, conn2))
                    //{
                    //    selectCommand2.Parameters.AddWithValue("@ParentPart", value.ToString());

                    //    await conn2.OpenAsync();
                    //    using (var reader = await selectCommand2.ExecuteReaderAsync())
                    //    {
                    //        while (await reader.ReadAsync())
                    //        {
                    //            childParts.Add(reader.GetString(0));
                    //        }
                    //    }
                    //}
                }
                catch (Exception ex)
                {
                    return StatusCode(400, "Some Error Happened");
                }
            }
            return Ok();
        }

        private List<string> getchildparts(string parentpart)
        {
            string selectStatement = "SELECT ChildPart FROM MafiaChildren WHERE ParentPart=@ParentPart";
            var childParts = new List<string>();
            using (var conn = new SqlConnection(PlutoConnectionString))
            using (var selectCommand = new SqlCommand(selectStatement, conn))
            {
                selectCommand.Parameters.AddWithValue("@ParentPart", parentpart);
                conn.Open();
                using (var reader = selectCommand.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        childParts.Add(reader.GetString(0));
                    }
                }
            }
            return childParts;
        }

        [HttpPost("checkwithJob")]
        public async Task<IActionResult> checkpartnum([FromBody] JobAsmblDto jobdto)
        {
            if (jobdto.jobNum == null)
                return BadRequest("Part Number not found");
            ;
            try
            {

                string baseUrl = "https://gccdtpilot14.epicorsaas.com/saas1143pilot/api/v1/Erp.BO.JobAsmSearchSvc/GetByID";

                using var httpClient = new HttpClient();

                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("License", "{\"ClaimedLicense\": \"00000003-079B-4C49-9D0A-EF8236247504\"}");
                httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", "U2h1a2xhV2ViQXBwOkJaRFpwRzdUQWpHMUxpJVlaTXZX");

                var body = new JobAsmblDto
                {
                    jobNum = jobdto.jobNum.ToString(),
                    assemblySeq = 0
                };

                string json1 = JsonConvert.SerializeObject(body, Formatting.Indented);

                System.Diagnostics.Debug.WriteLine("REQUEST JSON PAYLOAD:\n" + json1);
                string json = JsonConvert.SerializeObject(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);
                string responseBody = await response.Content.ReadAsStringAsync();

                Console.WriteLine("Status: " + response.StatusCode);
                Console.WriteLine("Response Body:\n" + responseBody);

                var jsonResponse = JObject.Parse(responseBody);
                string partnum = jsonResponse["returnObj"]?["JobAsmbl"]?[0]?["PartNum"]?.ToString() ?? "Not found";

                return Ok($"{partnum}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error posting to Epicor: " + ex.Message);
                Console.WriteLine("StackTrace:\n" + ex.StackTrace);
                return StatusCode(404,"No partnumber found");
            }
        }

        //Prakeerth's Code

        [HttpPost("get-jobnum-from-po-line")]
        public async Task<IActionResult> GetJobNumFromPOLine([FromBody] PODetailDto pORel)
        {
            string selectStatement = "SELECT JobNum FROM PORel WHERE PONum = @PONum AND POLine = @POLine";


            using (var conn = new SqlConnection(KineticConnectionString))
            using (var selectCommand = new SqlCommand(selectStatement, conn))
            {
                selectCommand.Parameters.AddWithValue("@PONum", pORel.PONum);
                selectCommand.Parameters.AddWithValue("@POLine", pORel.POLine);

                try
                {
                    await conn.OpenAsync();
                    var value = await selectCommand.ExecuteScalarAsync();

                    if (value == null || value == DBNull.Value)
                        return Ok("No part number found");
                    else
                        return Ok($"{value}");
                }
                catch (Exception ex)
                {
                    return StatusCode(400, "Some Error Happened");
                }
            }
                return Ok();
        //    if (pORel.POLine == null )
        //        return BadRequest("Part Number not found");
        //    ;
        //    try
        //    {

        //        String jobnum = jobhead.jobNum.ToString();
        //        string baseUrl = "https://gccdtpilot14.epicorsaas.com/saas1143pilot/api/v1/Erp.BO.JobAsmSearchSvc/GetByID";

        //        using var httpClient = new HttpClient();

        //        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        httpClient.DefaultRequestHeaders.Add("License", "{\"ClaimedLicense\": \"00000003-079B-4C49-9D0A-EF8236247504\"}");
        //        httpClient.DefaultRequestHeaders.Authorization =
        //            new AuthenticationHeaderValue("Basic", "U2h1a2xhV2ViQXBwOkJaRFpwRzdUQWpHMUxpJVlaTXZX");

        //        var body = new Jobhead
        //        {
        //            jobNum = jobnum,
        //            assemblySeq = 0
        //        };

        //        string json1 = JsonConvert.SerializeObject(body, Formatting.Indented);

        //        System.Diagnostics.Debug.WriteLine("REQUEST JSON PAYLOAD:\n" + json1);
        //        string json = JsonConvert.SerializeObject(body);
        //        var content = new StringContent(json, Encoding.UTF8, "application/json");

        //        var response = await httpClient.PostAsync(baseUrl, content);
        //        string responseBody = await response.Content.ReadAsStringAsync();

        //        Console.WriteLine("Status: " + response.StatusCode);
        //        Console.WriteLine("Response Body:\n" + responseBody);

        //        var jsonResponse = JObject.Parse(responseBody);
        //        string partnum = jsonResponse["returnObj"]?["JobAsmbl"]?[0]?["PartNum"]?.ToString() ?? "Not found";

        //        return Ok($"{partnum}");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("Error posting to Epicor: " + ex.Message);
        //        Console.WriteLine("StackTrace:\n" + ex.StackTrace);
        //        return StatusCode(404, "No partnumber found");
        //    }
        }

    }
}

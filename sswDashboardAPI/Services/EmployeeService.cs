


using Intuit.Ipp.Data;
using Intuit.Ipp.OAuth2PlatformClient;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Model.Time_and_Attendance;

using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Net.NetworkInformation;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;
using static sswDashboardAPI.Services.EmployeeService;

namespace sswDashboardAPI.Services
{

    public static class StringExtensions
    {
        public static string SubstringSafe(this string value, int startIndex, int length)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= length ? value : value.Substring(startIndex, length);
        }
    }
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;
        private readonly string _plutoConnectionString;

        public EmployeeService(IConfiguration configuration, AppDbContext context)
        {
            _plutoConnectionString = configuration.GetConnectionString("DefaultConnection");
            _context = context;
        }


       
        public async Task<LastActionResponse> GetLastAction(string empId)
        {
            var lastActionResponse = new LastActionResponse();

            if (!short.TryParse(empId, out short empIdShort))
                throw new ArgumentException("Invalid EmpId");

            var lastAction = await _context.TimeClock
                .AsNoTracking()
                .Where(t => t.EmpId == empIdShort.ToString() &&
                            (t.Approval == null || !t.Approval.Contains("PENDING")) &&
                            t.ClockType == "Normal")
                .OrderByDescending(t => t.ClockTime)
                .FirstOrDefaultAsync();

            if (lastAction != null)
            {
                lastActionResponse.MaxTime = lastAction.ClockTime;
                lastActionResponse.Status = lastAction.Status ?? "New";
            }
            else
            {
                lastActionResponse.MaxTime = default;
                lastActionResponse.Status = "OUT";
            }

            return lastActionResponse;
        }


        public async Task<LastActionResponse> GetLastActionBreak(string empId)
            {
            var lastActionResponse = new LastActionResponse();

            if (!short.TryParse(empId, out short empIdShort))
                throw new ArgumentException("Invalid EmpId");

            var lastAction = await _context.TimeClock
                .AsNoTracking()
                .Where(t => t.EmpId == empIdShort.ToString() &&
                            (t.Approval == null || !t.Approval.Contains("PENDING")) &&
                            t.ClockType == "Break")
                .OrderByDescending(t => t.ClockTime)
                .FirstOrDefaultAsync();

            if (lastAction != null)
            {
                lastActionResponse.MaxTime = lastAction.ClockTime;
                lastActionResponse.Status = lastAction.Status ?? "New";
            }
            else
            {
                lastActionResponse.MaxTime = default;
                lastActionResponse.Status = "OUT";
            }

            return lastActionResponse;
        }

            public async Task<LastActionResponse> GetLastActionBusiness(string empId)
            {
            var lastActionResponse = new LastActionResponse();

            if (!short.TryParse(empId, out short empIdShort))
                throw new ArgumentException("Invalid EmpId");

            var lastAction = await _context.TimeClock
                .AsNoTracking()
                .Where(t => t.EmpId == empIdShort.ToString() &&
                            (t.Approval == null || !t.Approval.Contains("PENDING")) &&
                            t.ClockType == "Business")
                .OrderByDescending(t => t.ClockTime)
                .FirstOrDefaultAsync();

            if (lastAction != null)
            {
                lastActionResponse.MaxTime = lastAction.ClockTime;
                lastActionResponse.Status = lastAction.Status ?? "New";
            }
            else
            {
                lastActionResponse.MaxTime = default;
                lastActionResponse.Status = "OUT";
            }

            return lastActionResponse;
        }

            public async Task<LastActionResponse> GetLastActionPersonal(string empId)
            {
            var lastActionResponse = new LastActionResponse();

            if (!short.TryParse(empId, out short empIdShort))
                throw new ArgumentException("Invalid EmpId");

            var lastAction = await _context.TimeClock
                .AsNoTracking()
                .Where(t => t.EmpId == empIdShort.ToString() &&
                            (t.Approval == null || !t.Approval.Contains("PENDING")) &&
                            t.ClockType == "Personal")
                .OrderByDescending(t => t.ClockTime)
                .FirstOrDefaultAsync();

            if (lastAction != null)
            {
                lastActionResponse.MaxTime = lastAction.ClockTime;
                lastActionResponse.Status = lastAction.Status ?? "New";
            }
            else
            {
                lastActionResponse.MaxTime = default;
                lastActionResponse.Status = "OUT";
            }

            return lastActionResponse;
        }



        public async Task<bool> InsertEmpBasicPLUTO(EmployeeDto emp)
        {


            string name = string.IsNullOrWhiteSpace(emp.MI)
                    ? $"{emp.FirstName} {emp.LastName}"
                    : $"{emp.FirstName} {emp.MI} {emp.LastName}";

            var empBasic = new EmpBasic
            {
                EmpID = emp.EmpID.ToString(),
                Name = string.IsNullOrWhiteSpace(emp.MI)
        ? $"{emp.FirstName} {emp.LastName}".Trim().SubstringSafe(0, 50)
        : $"{emp.FirstName} {emp.MI} {emp.LastName}".Trim().SubstringSafe(0, 50),
                FirstName = emp.FirstName?.SubstringSafe(0, 30),
                //MiddleInitial = emp.MI?.SubstringSafe(0, 1),
                LastName = emp.LastName?.SubstringSafe(0, 30),
                Address = emp.Street1?.SubstringSafe(0, 50),
                Address2 = emp.Street2?.SubstringSafe(0, 50),
                City = emp.City?.SubstringSafe(0, 50),
                State = emp.State?.SubstringSafe(0, 2),
                ZIP = emp.Zip?.SubstringSafe(0, 10),
                Country = emp.Country?.SubstringSafe(0, 30),
                Phone = emp.Phone?.SubstringSafe(0, 20),
                EmgContact = emp.EmgContact?.SubstringSafe(0, 50),
                SupervisorID = emp.Supervisor,
                EmpStatus = emp.EmpStatus?.SubstringSafe(0, 1),
                ExpenseCode = emp.ExpenseCode?.SubstringSafe(0, 10),
                JCDept = emp.Dept?.SubstringSafe(0, 10),
                RoleId = emp.RoleId,
                Company = "SSW",
                dcduserid = $"{emp.FirstName}.{emp.LastName}".SubstringSafe(0, 60),
                cnvempid = "NULL"
            };



            await _context.EmpBasic.AddAsync(empBasic);
            return await _context.SaveChangesAsync() > 0;
        }



        public async Task<bool> InsertKineticEmpBasicAsync(EmployeeDto employee)
        {
            try
            {

                String empID = employee.EmpID.ToString();
                string baseUrl = "https://gccdtpilot14.epicorsaas.com/saas1143pilot/api/v1/Erp.BO.EmpBasicSvc/EmpBasics";

                string name = string.IsNullOrWhiteSpace(employee.MI)
                    ? $"{employee.FirstName} {employee.LastName}"
                    : $"{employee.FirstName} {employee.MI} {employee.LastName}";

                using var httpClient = new HttpClient();

                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Add("License", "{\"ClaimedLicense\": \"00000003-079B-4C49-9D0A-EF8236247504\"}");
                httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", "U2h1a2xhV2ViQXBwOkJaRFpwRzdUQWpHMUxpJVlaTXZX");

                var body = new EmpBasicUpdateDTO
                {


                    Company = "SSW",
                    EmpID = empID,
                    Shift = employee.Shift,
                    Name = name.Trim(),
                    FirstName = employee.FirstName,
                    MiddleInitial = employee.MI,
                    LastName = employee.LastName,
                    Address = employee.Street1,
                    Address2 = employee.Street2,
                    City = employee.City,
                    State = employee.State,
                    ZIP = employee.Zip,
                    Country = employee.Country,
                    Phone = employee.Phone,

                    EmgContact = employee.EmgContact,
                    EmpStatus = employee.EmpStatus,
                    ExpenseCode = employee.ExpenseCode,
                    JCDept = employee.Dept,
                   

                    ShopSupervisor = false

                };






             

                string json1 = JsonConvert.SerializeObject(body, Formatting.Indented);

                System.Diagnostics.Debug.WriteLine("REQUEST JSON PAYLOAD:\n" + json1);
                string json = JsonConvert.SerializeObject(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync(baseUrl, content);
                string responseBody = await response.Content.ReadAsStringAsync();

                Console.WriteLine("Status: " + response.StatusCode);
                Console.WriteLine("Response Body:\n" + responseBody);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error posting to Epicor: " + ex.Message);
                Console.WriteLine("StackTrace:\n" + ex.StackTrace);
                return false;
            }
        }




        public async Task<bool> InsertEmployeeToEmployeesTable(EmployeeDto emp)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(emp.Password);

            var employees = new Employee
            {


                EmpId = emp.EmpID.ToString(),
                EmailAddress = emp.Email ?? string.Empty,
                Title = emp.Title ?? string.Empty,
                HireDate = emp.HireDate,
                ProjectsPassword = passwordHash
            };

            await _context.Employees.AddAsync(employees);
            return await _context.SaveChangesAsync() > 0;
        }

        public List<EmployeesDto> GetEmployees(string employeeType, bool isUSA)
        {
            var excludedIds = employeeType == "salaried"
                ? new List<string> { "2693", "2969" }
                : new List<string> { "2900", "2864", "2865" };

            if (employeeType == "salaried")
            {
                var groupedClocks = _context.TimeClock
                    .Where(tc =>
                        EF.Functions.DateDiffDay(tc.ClockTime, DateTime.Now) < 30 &&
                        (tc.Approval == null || !tc.Approval.ToUpper().Contains("PENDING")))
                    .GroupBy(tc => tc.EmpId)
                    .Select(g => g.OrderByDescending(tc => tc.ClockTime).FirstOrDefault())
                    .ToList();

                var empList = _context.EmpBasic
                 .Select(e => new
                 {
                     e.EmpID,
                     e.FirstName,
                     e.LastName,
                     e.EmpStatus,
                     e.ExpenseCode
                 })
                 .ToList();

                var timeClocks = groupedClocks
                    .Join(empList,
                        tc => tc.EmpId?.Trim().ToUpperInvariant(),
                        eb => eb.EmpID?.Trim().ToUpperInvariant(),
                        (tc, eb) => new { tc, eb })
                    .Where(joined =>
                        joined.eb.EmpStatus == "A" &&
                        joined.eb.ExpenseCode == "IDL" &&
                        !excludedIds.Contains(joined.eb.EmpID))
                    .OrderBy(joined => joined.eb.FirstName)
                    .Select(joined => new EmployeesDto
                    {
                        EmpId = joined.tc.EmpId,
                        Name = $"{joined.eb.FirstName} {joined.eb.LastName}",
                        Status = joined.tc.Status,
                        ReturningAt =  "N/A"
                    })
                    .ToList();

                return timeClocks;
            }
            else
            {
                var groupedClocks = _context.TimeClockFactory
                    .Where(tc =>
                        EF.Functions.DateDiffDay(tc.ClockTime, DateTime.Now) < 30 &&
                        (tc.Approval == null || !tc.Approval.ToUpper().Contains("PENDING")))
                    .GroupBy(tc => tc.EmpId)
                    .Select(g => g.OrderByDescending(tc => tc.ClockTime).FirstOrDefault())
                    .ToList();

                var empList = _context.EmpBasic
                .Select(e => new
                {
                    e.EmpID,
                    e.FirstName,
                    e.LastName,
                    e.EmpStatus,
                    e.ExpenseCode
                })
                .ToList();

                var timeClocks = groupedClocks
                    .Join(empList,
                        tc => tc.EmpId?.Trim().ToUpperInvariant(),
                        eb => eb.EmpID?.Trim().ToUpperInvariant(),
                        (tc, eb) => new { tc, eb })
                    .Where(joined =>
                        joined.eb.EmpStatus == "A" &&
                        joined.eb.ExpenseCode == "DL" &&
                        !excludedIds.Contains(joined.eb.EmpID))
                    .OrderBy(joined => joined.eb.FirstName)
                    .Select(joined => new EmployeesDto
                    {
                        EmpId = joined.tc.EmpId,
                        Name = $"{joined.eb.FirstName} {joined.eb.LastName}",
                        Status = joined.tc.Status,
                        ReturningAt =  "N/A"
                    })
                    .ToList();

                return timeClocks;
            }

        }

        public List<Users> GetUsers()
        {
            var users = (from e in _context.Employees
                         join b in _context.EmpBasic on e.EmpId equals b.EmpID
                         join s in _context.EmpBasic on b.SupervisorID equals s.EmpID into sup
                         from s in sup.DefaultIfEmpty()
                         where b.EmpStatus == "A" && b.Company == "SSW"
                         select new Users
                         {
                             EmpId = b.EmpID,
                             Name = b.FirstName + " " + b.LastName,
                             Status = b.EmpStatus,
                             Title = e.Title,
                             Supervisor = s != null ? s.FirstName + " " + s.LastName : ""
                         }).ToList();

            return users;
        }

      
        private async Task<bool> InsertClockEntry(string empId, string clockType, string status, DateTime? reportDate = null, bool remote = false)
        {
            

            var now = DateTime.Now;

            var entry = new TimeClock
            {
                ClockTime = now,
                ClockType = clockType,
                WeekNumber = (short)System.Globalization.CultureInfo.InvariantCulture.Calendar
                    .GetWeekOfYear(now, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday),
                Year = (short)now.Year,
                EmpId = empId,
                Computer = Environment.MachineName,
                Status = status,
                ReportDate = reportDate ?? DateTime.Today,
                Approval = "",
                Remote = remote
            };

            await _context.TimeClock.AddAsync(entry);


            try
            {
                return await _context.SaveChangesAsync() > 0;
                _context.ChangeTracker.Clear();
            }
            catch (DbUpdateException ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Insert failed: {innerMessage}", ex);
            }
        }


        public Task<bool> ClockInForDay(string empId, string myType)
        {
            var reportDate = myType == "tod" ? DateTime.Today : DateTime.Today.AddDays(1);
            var manualSelect = myType == "tod" || myType == "tom";
           
            return InsertClockEntry(empId, "Normal", "IN", reportDate, remote: false);
        }

        public Task<bool> ClockOutForDay(string empId) =>
            InsertClockEntry(empId, "Normal", "OUT");

        public Task<bool> ClockOutForLunch(string empId) =>
            InsertClockEntry(empId, "Break", "OUT");

        public Task<bool> ClockOutForBusiness(string empId) =>
            InsertClockEntry(empId, "Business", "OUT");

        public Task<bool> ClockOutForPersonal(string empId) =>
            InsertClockEntry(empId, "Personal", "OUT");

        public Task<bool> ClockInForLunch(string empId) =>
            InsertClockEntry(empId, "Break", "IN");

        public Task<bool> ClockInForBusiness(string empId) =>
            InsertClockEntry(empId, "Business", "IN");

        public Task<bool> ClockInForPersonal(string empId) =>
            InsertClockEntry(empId, "Personal", "IN");

       
        public async Task<WorkTime> GetWorkTimeForDay(string empId, DateTime reportDate)
        {
            var workTime = new WorkTime();

            try
            {
                // Query TimeClock entries with EF Core
                var entries = await _context.TimeClock
                    .Where(tc => tc.EmpId == empId
                        && tc.ClockTime >= reportDate.AddHours(-36))
                    .OrderBy(tc => tc.ClockTime)
                    .Select(tc => new TimeClockEntry
                    {
                        EmpId = tc.EmpId,
                        ClockType = tc.ClockType,
                        Status = tc.Status,
                        ClockTime = tc.ClockTime
                    })
                    .ToListAsync();

                var shiftStart = entries.FirstOrDefault(e => e.ClockType == "Normal" && e.Status == "IN");
                var shiftEnd = entries.LastOrDefault(e => e.ClockType == "Normal" && e.Status == "OUT");

                var breakStart = entries.LastOrDefault(e => e.ClockType == "Break" && e.Status == "OUT");
                var breakEnd = entries.FirstOrDefault(e => e.ClockType == "Break" && e.Status == "IN");

                workTime.EmpId = empId;
                workTime.ClockInTime = shiftStart?.ClockTime;
                workTime.ClockOutTime = shiftEnd?.ClockTime;
                workTime.BreakStartTime = breakStart?.ClockTime;
                workTime.BreakEndTime = breakEnd?.ClockTime;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                // You may want to log or rethrow or handle as per your app design
            }

            return workTime;
        }


        List<Employee> IEmployeeService.GetEmployees(string employeeType, bool isUSA)
        {
            throw new NotImplementedException();
        }

        public interface IEmployeeService
        {
            List<Employee> GetEmployees(string employeeType, bool isUSA);
            //List<Users> GetUsers();
            Task<bool> InsertEmpBasicPLUTO(EmployeeDto emp);
            Task<bool> InsertEmployeeToEmployeesTable(EmployeeDto emp);
            Task<LastActionResponse> GetLastAction(string empId);
            Task<LastActionResponse> GetLastActionBreak(string empId);
            Task<LastActionResponse> GetLastActionBusiness(string empId);
            Task<LastActionResponse> GetLastActionPersonal(string empId);
            Task<bool> ClockInForDay(string empId, string myType);
            Task<bool> ClockOutForDay(string empId);
            Task<bool> ClockOutForLunch(string empId);
            Task<bool> ClockOutForBusiness(string empId);
            Task<bool> ClockOutForPersonal(string empId);
            Task<bool> ClockInForLunch(string empId);
            Task<bool> ClockInForBusiness(string empId);
            Task<bool> ClockInForPersonal(string empId);
            Task<WorkTime> GetWorkTimeForDay(string empId, DateTime reportDate);
        }

        public class EmployeesDto
        {
            public string EmpId { get; set; }
            public string Name { get; set; }
            public string Status { get; set; }
            public string ReturningAt { get; set; }
        }

        public class Users
        {
            public string EmpId { get; set; }
            public string Name { get; set; }
            public string Status { get; set; }
            public string Title { get; set; }
            public string Supervisor { get; set; }
        }
    }






}
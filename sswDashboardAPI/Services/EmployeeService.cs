


using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using sswDashboardAPI.Model.Time_and_Attendance;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static sswDashboardAPI.Services.EmployeeService;

namespace sswDashboardAPI.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;
        private readonly string _plutoConnectionString;

        public EmployeeService(IConfiguration configuration, AppDbContext context)
        {
            _plutoConnectionString = configuration.GetConnectionString("DefaultConnection");
            _context = context;
        }


        //public class MyAdoNet()
        //{
            public async Task<LastActionResponse> GetLastAction(string empId)
            {
                var lastActionResponse = new LastActionResponse();

                // Try to parse empId into a valid number (short or int based on your DB schema)
                if (!short.TryParse(empId, out short empIdNumeric))
                {
                    throw new ArgumentException("EmpId must be a valid number.");
                }

                using (var conn = new SqlConnection(_plutoConnectionString))
                {
                    string query = @"
        SELECT 
            t1.ClockTime AS MaxTime,
            t1.Status
        FROM TimeClock t1
        WHERE t1.ClockTime = (
            SELECT MAX(t2.ClockTime)
            FROM TimeClock t2
            WHERE t2.empid = t1.empid
            AND (t2.APPROVAL NOT LIKE '%PENDING%' OR t2.APPROVAL IS NULL)
            AND t2.ClockType='Normal'
        )
        AND t1.empid = @empid
        AND (t1.APPROVAL NOT LIKE '%PENDING%' OR t1.APPROVAL IS NULL)";

                    using (var command = new SqlCommand(query, conn))
                    {
                        // Use SqlParameter and specify the parameter type
                        command.Parameters.Add(new SqlParameter("@empid", SqlDbType.SmallInt) { Value = empIdNumeric });
                        conn.Open();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                lastActionResponse.MaxTime = reader.IsDBNull(reader.GetOrdinal("MaxTime"))
                                    ? default(DateTime)
                                    : reader.GetDateTime(reader.GetOrdinal("MaxTime"));

                                lastActionResponse.Status = reader.IsDBNull(reader.GetOrdinal("Status"))
                                    ? "New"
                                    : reader.GetString(reader.GetOrdinal("Status"));
                            }
                            else
                            {
                                lastActionResponse.MaxTime = default(DateTime);
                                lastActionResponse.Status = "OUT";
                            }
                        }
                    }
                }

                return lastActionResponse;
            }

            public async Task<LastActionResponse> GetLastActionBreak(string empId)
            {
                var lastActionResponse = new LastActionResponse();

                using (var conn = new SqlConnection(_plutoConnectionString))
                {
                    string query = @"
            SELECT 
                t1.ClockTime AS MaxTime,
                t1.Status
            FROM TimeClock t1
            WHERE t1.ClockTime = (
                SELECT MAX(t2.ClockTime)
                FROM TimeClock t2
                WHERE t2.empid = t1.empid
                AND (t2.APPROVAL NOT LIKE '%PENDING%' OR t2.APPROVAL IS NULL)
                AND t2.ClockType='Break'
            )
            AND t1.empid = @empid
            AND (t1.APPROVAL NOT LIKE '%PENDING%' OR t1.APPROVAL IS NULL)";

                    using (var command = new SqlCommand(query, conn))
                    {
                        command.Parameters.AddWithValue("@empid", empId);
                        conn.Open();

                        using (var reader = await command.ExecuteReaderAsync())
                        {

                            if (await reader.ReadAsync())
                            {
                                lastActionResponse.MaxTime = reader.IsDBNull(reader.GetOrdinal("MaxTime"))
                                    ? default(DateTime)
                                    : reader.GetDateTime(reader.GetOrdinal("MaxTime"));

                                lastActionResponse.Status = reader.IsDBNull(reader.GetOrdinal("Status"))
                                    ? string.Empty
                                    : reader.GetString(reader.GetOrdinal("Status"));
                            }
                        }
                    }
                }

                return lastActionResponse;
            }

            public async Task<LastActionResponse> GetLastActionBusiness(string empId)
            {
                var lastActionResponse = new LastActionResponse();

                using (var conn = new SqlConnection(_plutoConnectionString))
                {
                    string query = @"
            SELECT 
                t1.ClockTime AS MaxTime,
                t1.Status
            FROM TimeClock t1
            WHERE t1.ClockTime = (
                SELECT MAX(t2.ClockTime)
                FROM TimeClock t2
                WHERE t2.empid = t1.empid
                AND (t2.APPROVAL NOT LIKE '%PENDING%' OR t2.APPROVAL IS NULL)
                AND t2.ClockType='Business'
            )
            AND t1.empid = @empid
            AND (t1.APPROVAL NOT LIKE '%PENDING%' OR t1.APPROVAL IS NULL)";

                    using (var command = new SqlCommand(query, conn))
                    {
                        command.Parameters.AddWithValue("@empid", empId);
                        conn.Open();

                        using (var reader = await command.ExecuteReaderAsync())
                        {

                            if (await reader.ReadAsync())
                            {
                                lastActionResponse.MaxTime = reader.IsDBNull(reader.GetOrdinal("MaxTime"))
                                    ? default(DateTime)
                                    : reader.GetDateTime(reader.GetOrdinal("MaxTime"));

                                lastActionResponse.Status = reader.IsDBNull(reader.GetOrdinal("Status"))
                                    ? string.Empty
                                    : reader.GetString(reader.GetOrdinal("Status"));
                            }
                        }
                    }
                }

                return lastActionResponse;
            }

            public async Task<LastActionResponse> GetLastActionPersonal(string empId)
            {
                var lastActionResponse = new LastActionResponse();

                using (var conn = new SqlConnection(_plutoConnectionString))
                {
                    string query = @"
            SELECT 
                t1.ClockTime AS MaxTime,
                t1.Status
            FROM TimeClock t1
            WHERE t1.ClockTime = (
                SELECT MAX(t2.ClockTime)
                FROM TimeClock t2
                WHERE t2.empid = t1.empid
                AND (t2.APPROVAL NOT LIKE '%PENDING%' OR t2.APPROVAL IS NULL)
                AND t2.ClockType='Personal'
            )
            AND t1.empid = @empid
            AND (t1.APPROVAL NOT LIKE '%PENDING%' OR t1.APPROVAL IS NULL)";

                    using (var command = new SqlCommand(query, conn))
                    {
                        command.Parameters.AddWithValue("@empid", empId);
                        conn.Open();

                        using (var reader = await command.ExecuteReaderAsync())
                        {

                            if (await reader.ReadAsync())
                            {
                                lastActionResponse.MaxTime = reader.IsDBNull(reader.GetOrdinal("MaxTime"))
                                    ? default(DateTime)
                                    : reader.GetDateTime(reader.GetOrdinal("MaxTime"));

                                lastActionResponse.Status = reader.IsDBNull(reader.GetOrdinal("Status"))
                                    ? string.Empty
                                    : reader.GetString(reader.GetOrdinal("Status"));
                            }
                        }
                    }
                }

                return lastActionResponse;
            }
        //}


        public async Task<bool> InsertEmpBasicPLUTO(EmployeeDto emp)
        {
            string name = string.IsNullOrWhiteSpace(emp.MI)
                ? $"{emp.FirstName} {emp.LastName}"
                : $"{emp.FirstName} {emp.MI} {emp.LastName}";

            var empBasic = new EmpBasic
            {
                EmpId = emp.EmpID.ToString(),
                Name = string.IsNullOrWhiteSpace(emp.MI)
        ? $"{emp.FirstName} {emp.LastName}".Trim()
        : $"{emp.FirstName} {emp.MI} {emp.LastName}".Trim(),
                firstname = emp.FirstName,
                middleinitial = emp.MI,
                lastname = emp.LastName,
                address = emp.Street1,
                address2 = emp.Street2,
                city = emp.City,
                state = emp.State,
                zip = emp.Zip,
                country = emp.Country,
                phone = emp.Phone,
                emgContact = emp.EmgContact,
                SupervisorId = emp.Supervisor,
                EmpStatus = emp.EmpStatus,
                expensecode = emp.ExpenseCode,
                JcDept = emp.Dept,
                RoleId = emp.RoleId,
                company = "SSW",
                dcduserid = $"{emp.FirstName}.{emp.LastName}",
                cnvempid = "NULL"
            };


            await _context.EmpBasic.AddAsync(empBasic);
            return await _context.SaveChangesAsync() > 0;
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
                     e.EmpId,
                     e.firstname,
                     e.lastname,
                     e.EmpStatus,
                     e.expensecode
                 })
                 .ToList();

                var timeClocks = groupedClocks
                    .Join(empList,
                        tc => tc.EmpId?.Trim().ToUpperInvariant(),
                        eb => eb.EmpId?.Trim().ToUpperInvariant(),
                        (tc, eb) => new { tc, eb })
                    .Where(joined =>
                        joined.eb.EmpStatus == "A" &&
                        joined.eb.expensecode == "IDL" &&
                        !excludedIds.Contains(joined.eb.EmpId))
                    .OrderBy(joined => joined.eb.firstname)
                    .Select(joined => new EmployeesDto
                    {
                        EmpId = joined.tc.EmpId,
                        Name = $"{joined.eb.firstname} {joined.eb.lastname}",
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
                    e.EmpId,
                    e.firstname,
                    e.lastname,
                    e.EmpStatus,
                    e.expensecode
                })
                .ToList();

                var timeClocks = groupedClocks
                    .Join(empList,
                        tc => tc.EmpId?.Trim().ToUpperInvariant(),
                        eb => eb.EmpId?.Trim().ToUpperInvariant(),
                        (tc, eb) => new { tc, eb })
                    .Where(joined =>
                        joined.eb.EmpStatus == "A" &&
                        joined.eb.expensecode == "DL" &&
                        !excludedIds.Contains(joined.eb.EmpId))
                    .OrderBy(joined => joined.eb.firstname)
                    .Select(joined => new EmployeesDto
                    {
                        EmpId = joined.tc.EmpId,
                        Name = $"{joined.eb.firstname} {joined.eb.lastname}",
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
                         join b in _context.EmpBasic on e.EmpId equals b.EmpId
                         join s in _context.EmpBasic on b.SupervisorId equals s.EmpId into sup
                         from s in sup.DefaultIfEmpty()
                         where b.EmpStatus == "A"
                         select new Users
                         {
                             EmpId = b.EmpId,
                             Name = b.firstname + " " + b.lastname,
                             Status = b.EmpStatus,
                             Title = e.Title,
                             Supervisor = s != null ? s.firstname + " " + s.lastname : ""
                         }).ToList();

            return users;
        }

       //MyEF All Last Actions() {

       //     private async Task<LastActionResponse> GetLastActionByType(string empId, string clockType)
       //     {
       //         clockType = clockType.Trim();

       //         empId = "3300";


       //         var maxTime = await _context.TimeClock
       //             .Where(t =>
       //                 t.EmpId == empId &&
       //                 t.ClockType == clockType &&
       //                 (t.Approval == "Approved" || !t.Approval.ToUpper().Contains("PENDING")))
       //             .MaxAsync(t => (DateTime?)t.ClockTime); // use nullable in case no data

       //         // Second: Retrieve the full row matching that max ClockTime
       //         var entry = await _context.TimeClock
       //             .Where(t =>
       //                 t.EmpId == empId &&
       //                 t.ClockTime == maxTime &&
       //                 (t.Approval == null || !t.Approval.ToUpper().Contains("PENDING")))
       //             .Select(t => new LastActionResponse
       //             {
       //                 MaxTime = t.ClockTime,
       //                 Status = t.Status
       //             })
       //             .FirstOrDefaultAsync();


       //         // Return fallback if not found
       //         return entry ?? new LastActionResponse
       //         {
       //             MaxTime = default,
       //             Status = (clockType == "Normal") ? "OUT" : string.Empty
       //         };
       //     }

       //     public Task<LastActionResponse> GetLastAction(string empId) =>
       // GetLastActionByType(empId, "Normal");

       //     public Task<LastActionResponse> GetLastActionBreak(string empId) =>
       // GetLastActionByType(empId, "Break");

       //     public Task<LastActionResponse> GetLastActionBusiness(string empId) =>
       // GetLastActionByType(empId, "Business");

       //     public Task<LastActionResponse> GetLastActionPersonal(string empId) =>
       // GetLastActionByType(empId, "Personal");

       // }


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

                Remote = remote
            };

            await _context.TimeClock.AddAsync(entry);

            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateException ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Insert failed: {innerMessage}", ex);
            }
        }


        // Handles the case where user selects a date via UI
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

            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();


                    string query = @"
                SELECT 
                    empID,
                    ClockType,
                    Status,
                    ClockTime
                FROM TimeClock
                WHERE empID = @empID
                  AND ClockTime >= DATEADD(hour, -36, @reportDate)
                ORDER BY ClockTime ASC;
            ";

                    var entries = new List<TimeClockEntry>();

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@empID", empId);
                        cmd.Parameters.AddWithValue("@reportDate", reportDate);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                entries.Add(new TimeClockEntry
                                {
                                    EmpId = reader["empID"].ToString(),
                                    ClockType = reader["ClockType"].ToString(),
                                    Status = reader["Status"].ToString(),
                                    ClockTime = reader["ClockTime"] as DateTime?
                                });
                            }
                        }
                    }


                    var shiftStart = entries.FirstOrDefault(e => e.ClockType == "Normal" && e.Status == "IN");
                    var shiftEnd = entries.Where(e => e.ClockType == "Normal" && e.Status == "OUT").LastOrDefault();


                    var breakStart = entries.Where(e => e.ClockType == "Break" && e.Status == "OUT").LastOrDefault();
                    var breakEnd = entries.Where(e => e.ClockType == "Break" && e.Status == "IN").FirstOrDefault();


                    workTime.EmpId = empId;
                    workTime.ClockInTime = shiftStart?.ClockTime;
                    workTime.ClockOutTime = shiftEnd?.ClockTime;
                    workTime.BreakStartTime = breakStart?.ClockTime;
                    workTime.BreakEndTime = breakEnd?.ClockTime;


                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            return workTime;
        }

        //public async Task<WorkTime> GetWorkTimeForDay(string empId, DateTime reportDate)
        //{
        //    var lowerBound = reportDate.AddHours(-36);
        //    var entries = await _context.TimeClock
        //        .Where(e => e.EmpId == empId && e.ClockTime >= lowerBound)
        //        .OrderBy(e => e.ClockTime)
        //        .ToListAsync();

        //    var workTime = new WorkTime
        //    {
        //        EmpId = empId,
        //        ClockInTime = entries.FirstOrDefault(e => e.ClockType == "Normal" && e.Status == "IN")?.ClockTime,
        //        ClockOutTime = entries.LastOrDefault(e => e.ClockType == "Normal" && e.Status == "OUT")?.ClockTime,
        //        BreakStartTime = entries.LastOrDefault(e => e.ClockType == "Break" && e.Status == "OUT")?.ClockTime,
        //        BreakEndTime = entries.FirstOrDefault(e => e.ClockType == "Break" && e.Status == "IN")?.ClockTime
        //    };

        //    return workTime;
        //}

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
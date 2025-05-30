using Microsoft.Data.SqlClient;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model;
using System.Data;

namespace sswDashboardAPI.Services
{
    public class EmployeeService
    {
        private readonly AppDbContext _context;
        private readonly string _plutoConnectionString;

        public EmployeeService(IConfiguration configuration, AppDbContext context)
        {
            _plutoConnectionString = configuration.GetConnectionString("DefaultConnection");
            _context = context;
        }

        public async Task<bool> InsertEmpBasicPLUTO(EmployeeDto emp)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                string name = string.IsNullOrWhiteSpace(emp.MI)
                    ? $"{emp.FirstName} {emp.LastName}"
                    : $"{emp.FirstName} {emp.MI} {emp.LastName}";

                string query = @"INSERT INTO empbasic (cnvempid, dcduserid, name, company, firstname, middleinitial, lastname, address, address2, city, state, zip, country, phone,  emgContact, empstatus, expensecode, jcdept, supervisorid, empid,  roleid)
                             VALUES (@blank, @blank, @name, @company, @firstname, @middleinitial, @lastname, @address, @address2, @city, @state, @zip, @country, @phone, @emgcontact, @empstatus, @expensecode, @jcdept, @supervisorid, @empid,  @roleid);";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@blank", "");
                    cmd.Parameters.AddWithValue("@name", name.Trim());
                    cmd.Parameters.AddWithValue("@company", "SSW");
                    cmd.Parameters.AddWithValue("@firstname", emp.FirstName);
                    cmd.Parameters.AddWithValue("@middleinitial", emp.MI);
                    cmd.Parameters.AddWithValue("@lastname", emp.LastName);
                    cmd.Parameters.AddWithValue("@address", emp.Street1);
                    cmd.Parameters.AddWithValue("@address2", emp.Street2);
                    cmd.Parameters.AddWithValue("@city", emp.City);
                    cmd.Parameters.AddWithValue("@state", emp.State);
                    cmd.Parameters.AddWithValue("@zip", emp.Zip);
                    cmd.Parameters.AddWithValue("@country", emp.Country);
                    cmd.Parameters.AddWithValue("@phone", emp.Phone);

                    cmd.Parameters.AddWithValue("@emgcontact", emp.EmgContact);
                    cmd.Parameters.AddWithValue("@empstatus", emp.EmpStatus);
                    cmd.Parameters.AddWithValue("@expensecode", emp.ExpenseCode);
                    cmd.Parameters.AddWithValue("@jcdept", emp.Dept);
                    cmd.Parameters.AddWithValue("@supervisorid", emp.Supervisor);
                    cmd.Parameters.AddWithValue("@empid", emp.EmpID);

                    cmd.Parameters.AddWithValue("@roleid", emp.RoleId);

                    await conn.OpenAsync();
                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> InsertEmployeeToEmployeesTable(EmployeeDto emp)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                string query = @"INSERT INTO Employees (EmpID,EmailAddress,Title,HireDate, ProjectsPassword)
                         VALUES (@EmpID, @Email,@Title,@HireDate, @PasswordHash)";

                using (var cmd = new SqlCommand(query, conn))
                {
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(emp.Password);

                    cmd.Parameters.AddWithValue("@EmpID", emp.EmpID); 
                    cmd.Parameters.AddWithValue("@Email", emp.Email ?? "");
                    cmd.Parameters.AddWithValue("@Title", emp.Title ?? "");
                    cmd.Parameters.AddWithValue("@HireDate", emp.HireDate);
                    cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);

                    await conn.OpenAsync();
                    int rows = await cmd.ExecuteNonQueryAsync();
                    return rows > 0;
                }
            }
        }

        public List<Employee> GetEmployees(string employeeType, bool isUSA)
        {
            var employees = new List<Employee>();
            string query = string.Empty;

            if (employeeType == "salaried")
            {
                query = isUSA
                    ? @"select convert(nvarchar(255), t.empid) as temp, convert(nvarchar(255), Name) as Name, Status, backTime as 'Returning At', empbasic.empstatus 
                        from (select *, ROW_NUMBER() over (partition by empid order by clocktime desc) TimeRank FROM TimeClock  
                        WHERE (datediff(dd, clocktime, getdate()) < 30) AND ((APPROVAL not like '%PENDING%' OR APPROVAL IS NULL))) T 
                        inner join EMPBASIC ON convert(nvarchar(255), empbasic.empid) = convert(nvarchar(255), T.empID) 
                        where TimeRank = 1 AND empbasic.empstatus = 'A' AND empbasic.expensecode = 'IDL' 
                        and (empbasic.empid <> '2693' and empbasic.empid <> '2969') 
                        order by Name ASC;"
                    : @"select convert(nvarchar(255), t.empid) as temp, convert(nvarchar(255), Name) as Name, Status, backTime as 'Returning At', empbasic.empstatus 
                        from (select *, ROW_NUMBER() over (partition by empid order by clocktime desc) TimeRank FROM TimeClock  
                        WHERE (datediff(dd, clocktime, getdate()) < 30) AND ((APPROVAL not like '%PENDING%' OR APPROVAL IS NULL))) T 
                        inner join EMPBASIC ON convert(nvarchar(255), empbasic.empid) = convert(nvarchar(255), T.empID) 
                        where TimeRank = 1 AND empbasic.empstatus = 'A' AND empbasic.expensecode = 'IDL' 
                        and (empbasic.empid <> '2693' and empbasic.empid <> '2969') 
                        order by Name ASC;";
            }
            else if (employeeType == "hourly")
            {
                query = isUSA
                    ? @"select convert(nvarchar(255), t.empid) as temp, convert(nvarchar(255), Name) as Name, Status, backTime as 'Returning At', empbasic.empstatus 
                        from (select *, ROW_NUMBER() over (partition by empid order by clocktime desc) TimeRank FROM TimeClockFactory  
                        WHERE (datediff(dd, clocktime, getdate()) < 30) AND ((APPROVAL not like '%PENDING%' OR APPROVAL IS NULL))) T 
                        inner join EMPBASIC ON convert(nvarchar(255), empbasic.empid) = convert(nvarchar(255), T.empID) 
                        where TimeRank = 1 AND empbasic.empstatus = 'A' and empbasic.expensecode = 'DL' 
                        and (t.empid <> '2900' and t.empid <> '2864' and t.empid <> '2865');"
                    : @"select convert(nvarchar(255), t.empid) as temp, convert(nvarchar(255), Name) as Name, Status, backTime as 'Returning At', empbasic.empstatus 
                        from (select *, ROW_NUMBER() over (partition by empid order by clocktime desc) TimeRank FROM TimeClockFactory  
                        WHERE (datediff(dd, clocktime, getdate()) < 30) AND ((APPROVAL not like '%PENDING%' OR APPROVAL IS NULL))) T 
                        inner join EMPBASIC ON convert(nvarchar(255), empbasic.empid) = convert(nvarchar(255), T.empID) 
                        where TimeRank = 1 AND empbasic.empstatus = 'A' and empbasic.expensecode = 'DL' 
                        and (t.empid <> '2900' and t.empid <> '2864' and t.empid <> '2865');";
            }

            using (var connection = new SqlConnection(_plutoConnectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(query, connection))
                {
                    var reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        // Check if the columns exist in the result set
                        string empId = reader["temp"] != DBNull.Value ? reader["temp"].ToString() : string.Empty;
                        string name = reader["Name"] != DBNull.Value ? reader["Name"].ToString() : string.Empty;
                        string status = reader["Status"] != DBNull.Value ? reader["Status"].ToString() : string.Empty;
                        string returningAt = reader["Returning At"] != DBNull.Value ? reader["Returning At"].ToString() : string.Empty;

                        employees.Add(new Employee
                        {
                            EmpId = empId,
                            Name = name,
                            Status = status,
                            ReturningAt = "N/A"
                        });
                    }

                }
            }

            return employees;
        }

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
                        else {
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

        public async Task<bool> ClockInForDay(string empId, string myType)
        {
            using (var connection = new SqlConnection(_plutoConnectionString))
            {
                var query = @"
            INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, manualSelect, remote)
            VALUES (SYSDATETIME(), 'Normal', DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empId, @computer, 'IN', @reportDate, @manualSelect, @remote)";

                var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@empId", empId);
                command.Parameters.AddWithValue("@computer", Environment.MachineName);
                command.Parameters.AddWithValue("@reportDate", myType == "tod" ? DateTime.Today : DateTime.Today.AddDays(1));
                command.Parameters.AddWithValue("@manualSelect", myType == "tod" || myType == "tom");
                command.Parameters.AddWithValue("@remote", false); // Assume not remote, modify as needed

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
        }

        public async Task<bool> ClockOutForDay(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Normal");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "OUT");

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> ClockOutForLunch(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, remote)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status, @reportDate, @remote);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Break");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "OUT");
                        cmd.Parameters.AddWithValue("@reportDate", DateTime.Today);

                        bool remote = false;
                        cmd.Parameters.AddWithValue("@remote", remote);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> ClockOutForBusiness(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, remote)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status, @reportDate, @remote);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Business");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "OUT");
                        cmd.Parameters.AddWithValue("@reportDate", DateTime.Today);

                        bool remote = false;
                        cmd.Parameters.AddWithValue("@remote", remote);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> ClockOutForPersonal(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, remote)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status, @reportDate, @remote);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Personal");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "OUT");
                        cmd.Parameters.AddWithValue("@reportDate", DateTime.Today);

                        bool remote = false;
                        cmd.Parameters.AddWithValue("@remote", remote);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> ClockInForLunch(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, remote)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status, @reportDate, @remote);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Break");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "IN");
                        cmd.Parameters.AddWithValue("@reportDate", DateTime.Today);

                        bool remote = false;
                        cmd.Parameters.AddWithValue("@remote", remote);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> ClockInForBusiness(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, remote)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status, @reportDate, @remote);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Business");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "IN");
                        cmd.Parameters.AddWithValue("@reportDate", DateTime.Today);

                        bool remote = false;
                        cmd.Parameters.AddWithValue("@remote", remote);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> ClockInForPersonal(string empId)
        {
            using (var conn = new SqlConnection(_plutoConnectionString))
            {
                try
                {
                    await conn.OpenAsync();

                    string query = @"INSERT INTO TimeClock (ClockTime, ClockType, WeekNumber, Year, empID, computer, status, reportDate, remote)
                             VALUES (SYSDATETIME(), @ClockType, DATEPART(WK, SYSDATETIME()), DATEPART(YEAR, SYSDATETIME()), @empid, @computer, @status, @reportDate, @remote);";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@ClockType", "Personal");
                        cmd.Parameters.AddWithValue("@empid", empId);
                        cmd.Parameters.AddWithValue("@computer", Environment.MachineName);
                        cmd.Parameters.AddWithValue("@status", "IN");
                        cmd.Parameters.AddWithValue("@reportDate", DateTime.Today);

                        bool remote = false;
                        cmd.Parameters.AddWithValue("@remote", remote);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    return false;
                }
            }
        }

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
                    MAX(CASE WHEN ClockType = 'Normal' AND status = 'IN' THEN ClockTime END) AS ClockInTime,
                    MAX(CASE WHEN ClockType = 'Normal' AND status = 'OUT' THEN ClockTime END) AS ClockOutTime,
                    MAX(CASE WHEN ClockType = 'Break' AND status = 'OUT' THEN ClockTime END) AS BreakStartTime,
                    MIN(CASE WHEN ClockType = 'Break' AND status = 'IN' THEN ClockTime END) AS BreakEndTime,
                    MAX(CASE WHEN ClockType = 'Business' AND status = 'OUT' THEN ClockTime END) AS BusinessStartTime,
                    MIN(CASE WHEN ClockType = 'Business' AND status = 'IN' THEN ClockTime END) AS BusinessEndTime,
                    MAX(CASE WHEN ClockType = 'Personal' AND status = 'OUT' THEN ClockTime END) AS PersonalStartTime,
                    MIN(CASE WHEN ClockType = 'Personal' AND status = 'IN' THEN ClockTime END) AS PersonalEndTime
                FROM TimeClock
                WHERE empID = @empID
                    AND reportDate = @reportDate
                GROUP BY empID, reportDate;
            ";

                    using (var cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@empID", empId);
                        cmd.Parameters.AddWithValue("@reportDate", reportDate);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                workTime.EmpId = reader["empID"].ToString();
                                workTime.ClockInTime = reader["ClockInTime"] as DateTime?;
                                workTime.ClockOutTime = reader["ClockOutTime"] as DateTime?;
                                workTime.BreakStartTime = reader["BreakStartTime"] as DateTime?;
                                workTime.BreakEndTime = reader["BreakEndTime"] as DateTime?;
                                workTime.BusinessStartTime = reader["BusinessStartTime"] as DateTime?;
                                workTime.BusinessEndTime = reader["BusinessEndTime"] as DateTime?;
                                workTime.PersonalStartTime = reader["PersonalStartTime"] as DateTime?;
                                workTime.PersonalEndTime = reader["PersonalEndTime"] as DateTime?;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            return workTime;
        }


    }

    public interface IEmployeeService
    {
        List<Employee> GetEmployees(string employeeType, bool isUSA);
    }

    public class Employee
    {
        public string EmpId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string ReturningAt { get; set; }
    }

}



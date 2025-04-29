using Microsoft.Data.SqlClient;
using sswDashboardAPI.Model;

namespace sswDashboardAPI.Services
{
    public class EmployeeService
    {
        private readonly string _plutoConnectionString;

        public EmployeeService(IConfiguration configuration)
        {
            _plutoConnectionString = configuration.GetConnectionString("DefaultConnection");
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

    }

}

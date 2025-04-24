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

                string query = @"INSERT INTO empbasic (cnvempid, dcduserid, name, company, firstname, middleinitial, lastname, address, address2, city, state, zip, country, phone, emgphone, emgContact, empstatus, expensecode, jcdept, supervisorid, empid, rate)
                             VALUES (@blank, @blank, @name, @company, @firstname, @middleinitial, @lastname, @address, @address2, @city, @state, @zip, @country, @phone, @emgphone, @emgcontact, @empstatus, @expensecode, @jcdept, @supervisorid, @empid, @rate);";

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
                    cmd.Parameters.AddWithValue("@emgphone", emp.EmgPhone);
                    cmd.Parameters.AddWithValue("@emgcontact", emp.EmgContact);
                    cmd.Parameters.AddWithValue("@empstatus", emp.EmpStatus);
                    cmd.Parameters.AddWithValue("@expensecode", emp.ExpenseCode);
                    cmd.Parameters.AddWithValue("@jcdept", emp.Dept);
                    cmd.Parameters.AddWithValue("@supervisorid", emp.Supervisor);
                    cmd.Parameters.AddWithValue("@empid", emp.EmpID);
                    cmd.Parameters.AddWithValue("@rate", emp.Rate);

                    await conn.OpenAsync();
                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }
    }

}

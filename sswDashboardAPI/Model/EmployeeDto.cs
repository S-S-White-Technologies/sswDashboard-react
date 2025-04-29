using System.ComponentModel.DataAnnotations;

namespace sswDashboardAPI.Model
{
    public class EmployeeDto
    {
        [Key]
        public int EmpID { get; set; }
        public string FirstName { get; set; }
        public string MI { get; set; }
        public string LastName { get; set; }
        public string Street1 { get; set; }
        public string Street2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
       
        public string EmgContact { get; set; }
        public int EpoLimit { get; set; }
        public DateTime HireDate { get; set; }
        public int Grade { get; set; }
        public string Type { get; set; }
        //public bool Temporary { get; set; }
        public decimal Rate { get; set; }
        public string EmpStatus { get; set; }
        public string ExpenseCode { get; set; }
        public short Shift { get; set; }
        public string Supervisor { get; set; }
        public string Dept { get; set; }
        public string Extension { get; set; }
        public string Email { get; set; }
        public string WindowsID { get; set; } 
        public string Title { get; set; }
        public string CompanyCell { get; set; }

        public string Gender { get; set; }
        
        public int FtoOffset { get; set; }
        public string Password { get; set; }
        

        //public IFormFile? UploadImage { get; set; }

        public int RoleId { get; set; } 

    }


}

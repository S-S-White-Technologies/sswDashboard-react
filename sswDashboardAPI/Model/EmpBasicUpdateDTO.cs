namespace sswDashboardAPI.Model
{
    public class EmpBasicUpdateDTO
    {
        public string EmpID { get; set; }
        public string Name { get; set; }
   
        public string EmpStatus { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleInitial { get; set; }
        public string ExpenseCode { get; set; }
        public string JCDept { get; set; }
        public string Company { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZIP { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string EmgContact { get; set; }
       
        public int Shift { get; set; }
      

        public bool ShopSupervisor { get; set; }
    }



}

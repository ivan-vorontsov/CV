using System;
using System.Data;
using System.Data.SqlClient;
using Figures.Models;

namespace Figures.Helper
{
    public static class SqlClientHelper
    {
        public static CustomerModel GetData(int customerId)
        {
            var connection = Environment.GetEnvironmentVariable("connectionString");
            CustomerModel customer = new CustomerModel();
            using (SqlConnection conn = new SqlConnection(connection))
            {
                var text = "SELECT CustomerID, " +
                    "NameStyle, FirstName, MiddleName, " +
                    "LastName, CompanyName FROM SalesLT.Customer where CustomerId=" + customerId;
                SqlCommand cmd = new SqlCommand(text, conn);
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.SingleRow))
                {
                    while(reader.Read() && reader.HasRows)
                    {
                        customer.CustomerID = Convert.ToInt32(reader["CustomerID"].ToString());
                        customer.FirstName = reader["FirstName"].ToString();
                        customer.MiddleName = reader["MiddleName"].ToString();
                        customer.LastName = reader["LastName"].ToString();
                        customer.CompanyName = reader["CompanyName"].ToString();
                    }
                    conn.Close();
                }
            }
            return customer;
        }
    }
}

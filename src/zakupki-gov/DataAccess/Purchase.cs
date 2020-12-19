using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.OpenApi.Expressions;

namespace Purchases.DataAccess
{
    public class Purchase
    {
        public long Id { get; set; }

        public string Description { get; set; }
        public string Url { get; set; }
        public string CustomerName { get; set; }

        public PuchaseSource PuchaseSource { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public decimal Sum { get; set; }
        public string SupplierName { get; set; }
        public string SupplierINN { get; set; }

        public Guid LoadID { get; set; }
    }
}

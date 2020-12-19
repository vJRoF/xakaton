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
    }
}

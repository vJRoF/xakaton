using System.Collections.Generic;
using Kendo.Mvc.Infrastructure;

namespace Purchases
{
    public class DataSourceResultModel<T>
    {
        public IEnumerable<T> Data { get; set; }

        public int Total { get; set; }

        public IEnumerable<AggregateResult> AggregateResults { get; set; }

        public object Errors { get; set; }
    }
}

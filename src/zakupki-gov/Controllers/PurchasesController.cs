using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Purchases.DataAccess;
using System.Net.Http;
using System.Threading.Tasks;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

namespace Purchases.Controllers
{
    [Route("api/purchases")]
    [ApiController]
    public class PurchasesController : Controller
    {
        private readonly PurchasesContext _purchasesContext;

        public PurchasesController(
            PurchasesContext purchasesContext)
        {
            _purchasesContext = purchasesContext;
        }

        [HttpGet("list")]
        [Produces(typeof(DataSourceResultModel<Purchase>))]
        public DataSourceResult GetList([DataSourceRequest] DataSourceRequest request)
        {
            var result = _purchasesContext.Purchases.ToDataSourceResult(request);
            return result;
        }

        [HttpGet("ip")]
        public async Task<string> GetIp()
        {
            var httpClient = new HttpClient();
            var result = await httpClient.GetAsync("https://www.myip.com/");
            return await result.Content.ReadAsStringAsync();
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DataAccess;

namespace Purchases.Controllers
{
    [Route("api/purchases")]
    [ApiController]
    public class PurchasesController : ControllerBase
    {
        private readonly PurchasesContext _purchasesContext;

        public PurchasesController(
            PurchasesContext purchasesContext)
        {
            _purchasesContext = purchasesContext;
        }

        [HttpGet("list")]
        public Purchase[] GetList()
        {
            return _purchasesContext.Purchases.ToArray();
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

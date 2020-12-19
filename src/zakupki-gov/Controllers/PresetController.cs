using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using Purchases.DataAccess;

namespace Purchases.Controllers
{
    [Route("api/preset")]
    [ApiController]
    public class PresetController : Controller
    {
        private readonly PurchasesContext _context;

        public PresetController(PurchasesContext context)
        {
            _context = context;
        }

        /// <summary>
        ///     Получить список пресетов
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public Preset[] List()
        {
            return _context.Presets.ToArray();
        }
    }
}

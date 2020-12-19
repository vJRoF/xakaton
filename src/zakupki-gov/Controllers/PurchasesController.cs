using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Purchases.DataAccess;
using System.Net.Http;
using System.Threading.Tasks;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using ClosedXML.Excel;

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

        /// <summary>
        ///     Получить список в с соответствии с параметрами запроса kendo grid
        /// </summary>
        /// <param name="request">Запрос от kendo grid</param>
        /// <returns></returns>
        [HttpGet("list")]
        [Produces(typeof(DataSourceResultModel<Purchase>))]
        public DataSourceResult GetList([DataSourceRequest] DataSourceRequest request)
        {
            var result = _purchasesContext.Purchases.ToDataSourceResult(request);
            return result;
        }

        /// <summary>
        ///     Выполнить экспорт всех записей, удовлетворяющих критериям фильтрации
        /// </summary>
        /// <param name="request">Запрос от kendo grid</param>
        /// <returns></returns>
        [HttpGet("export")]
        [Produces(typeof(DataSourceResultModel<Purchase>))]
        public FileResult ExportExcel([DataSourceRequest] DataSourceRequest request)
        {
            request.Page = 1;
            request.PageSize = Int32.MaxValue;
            var result = _purchasesContext.Purchases.ToDataSourceResult(request);
            return File(CreateReport(result.Data.Cast<Purchase>().ToArray()),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

        /// <summary>
        ///     Способ узнать IP приложени
        ///     IP heroku иногда меняется и его нужно перенастраивать в Azure
        /// </summary>
        /// <returns></returns>
        [HttpGet("ip")]
        public async Task<string> GetIp()
        {
            var httpClient = new HttpClient();
            var result = await httpClient.GetAsync("https://www.myip.com/");
            return await result.Content.ReadAsStringAsync();
        }

        private byte[] CreateReport(IReadOnlyCollection<Purchase> purchases)
        {
            var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Purchases");
            
            var cell = 0;
            var row = ws.FirstRow();
            row.Cell(++cell).SetValue("Описание");
            row.Cell(++cell).SetValue("Дата создания");
            row.Cell(++cell).SetValue("Сумма, руб.");
            row.Cell(++cell).SetValue("Заказчик");
            row.Cell(++cell).SetValue("Подрядчик");
            row.Cell(++cell).SetValue("ИНН подрядчика");
            row = row.RowBelow();
            cell = 0;

            foreach (var purchase in purchases)
            {
                row.Cell(++cell).SetValue(purchase.Description);
                row.Cell(++cell).SetValue(purchase.CreatedAt.DateTime);
                row.Cell(++cell).SetValue(purchase.Sum);
                row.Cell(++cell).SetValue(purchase.CustomerName);
                row.Cell(++cell).SetValue(purchase.SupplierName);
                row.Cell(++cell).SetValue(purchase.SupplierINN);

                row = row.RowBelow();
                cell = 0;
            }

            ws.Range(ws.FirstCellUsed(), ws.LastCellUsed()).CreateTable();

            using var ms = new MemoryStream();
            wb.SaveAs(ms);
            return ms.ToArray();
        }
    }
}

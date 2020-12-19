using DataAccess;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Xml.Linq;
using Purchases.DataAccess;

namespace Pumps
{
    class FtpToBase
    {
        public static void Run()
        {
            XNamespace ns2 = "http://zakupki.gov.ru/223fz/orderClauseList/1";
            var purchases = new List<Purchase>();

            foreach (var file in Directory.EnumerateFiles(@"C:\Temp\ftp"))
            {
                using ZipArchive archive = ZipFile.OpenRead(file);
                foreach (ZipArchiveEntry entry in archive.Entries)
                {
                    var purchase = new Purchase { PuchaseSource = PuchaseSource.Ftp };
                    if (entry.FullName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
                    {
                        XDocument doc;
                        try
                        {
                            doc = XDocument.Load(entry.Open());
                        }
                        catch
                        {
                            continue;
                        }
                        

                        var orderClauseData = doc.Root.Element(ns2 + "body").Element(ns2 + "item")
                            .Element(ns2 + "orderClauseData");
                        if (orderClauseData == null)
                            continue;

                        var createDateTime = orderClauseData.Element(ns2 + "createDateTime");
                        if (createDateTime != null)
                        {
                            if (DateTimeOffset.TryParse(createDateTime.Value, out var createdAt))
                                purchase.CreatedAt = createdAt;
                        }

                        var urlOOS = orderClauseData.Element(ns2 + "urlOOS");
                        if (urlOOS != null)
                            purchase.Url = urlOOS.Value;

                        var urlEIS = orderClauseData.Element(ns2 + "urlEIS");
                        if (urlEIS != null)
                            purchase.Url = urlEIS.Value;

                        var customerInfo = orderClauseData.Element(ns2 + "customer")?.Element("mainInfo");
                        if (customerInfo != null)
                        {
                            purchase.CustomerName = customerInfo.Element("fullName")?.Value;
                        }

                        var description = orderClauseData.Element(ns2 + "modificationDescription");
                        if (description != null)
                            purchase.Description = description.Value;
                    }

                    purchases.Add(purchase);
                }
            }
        }
    }
}

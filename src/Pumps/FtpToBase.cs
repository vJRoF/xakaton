using DataAccess;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Purchases.DataAccess;

namespace Pumps
{
    class FtpToBase
    {
        public static void Run()
        {
            var loadId = Guid.NewGuid();
            var purchases = new List<Purchase>();

            foreach (var file in Directory.EnumerateFiles(@"C:\Temp\ftp\purchaseContract"))
            {
                ZipArchive archive;
                try
                {
                    archive = ZipFile.OpenRead(file);
                }
                catch
                {
                    continue;
                }

                foreach (ZipArchiveEntry entry in archive.Entries)
                {
                    //var dick = new Dictionary<string, string>();
                    var purchase = new Purchase { PuchaseSource = PuchaseSource.Ftp, LoadID = loadId};
                    if (entry.FullName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
                    {
                        XDocument doc;
                        try
                        {
                            using var entryStream = entry.Open();
                            using var reader = new StreamReader(entryStream);
                            var content = reader.ReadToEnd();
                            content = Regex.Replace(content, @"<ns\d+?:", "<", RegexOptions.Compiled);
                            content = Regex.Replace(content, @"<\/ns\d+?:", "</", RegexOptions.Compiled);
                            content = Regex.Replace(content, @"(xmlns:?[^=]*=[""][^""]*[""])", "",
                                RegexOptions.Compiled);
                            content = Regex.Replace(content, @"(xsi:?[^=]*=[""][^""]*[""])", "",
                                RegexOptions.Compiled);
                            doc = XDocument.Parse(content);
                        }
                        catch (Exception ex)
                        {
                            continue;
                        }


                        var purchaseContractData = doc.Root.Element("body").Element("item")
                            .Element("purchaseContractData");
                        if (purchaseContractData == null)
                            continue;

                        //dick.Add("RegistrationNumber", purchaseContractData.Element("registrationNumber")?.Value);

                        var createDateTime = purchaseContractData.Element("createDateTime");
                        if (createDateTime != null)
                        {
                            if (DateTimeOffset.TryParse(createDateTime.Value, out var createdAt))
                                purchase.CreatedAt = createdAt;
                        }

                        var urlOOS = purchaseContractData.Element("urlOOS");
                        if (urlOOS != null)
                            purchase.Url = urlOOS.Value;

                        var urlEIS = purchaseContractData.Element("urlEIS");
                        if (urlEIS != null)
                            purchase.Url = urlEIS.Value;

                        var subject = purchaseContractData.Element("lot")?.Element("subject");
                        if (subject != null)
                            purchase.Description = subject.Value;

                        var sum = purchaseContractData.Element("sum");
                        if (sum != null)
                        {
                            if (decimal.TryParse(sum.Value, out var sumValue))
                                purchase.Sum = sumValue;
                        }

                        var customerInfo = purchaseContractData.Element("customerInfo");
                        if (customerInfo != null)
                        {
                            purchase.CustomerName = customerInfo.Element("fullName")?.Value;
                        }

                        var supplierInfo = purchaseContractData.Element("supplier")?.Element("mainInfo");
                        if (supplierInfo != null)
                        {
                            purchase.SupplierName = supplierInfo.Element("name")?.Value;
                            purchase.SupplierINN = supplierInfo.Element("inn")?.Value;
                        }
                    }

                    purchases.Add(purchase);

                    if (purchases.Count == 100)
                    {
                        var optionsBuilder = new DbContextOptionsBuilder<PurchasesContext>();

                        var options = optionsBuilder
                            .UseSqlServer(@"Server=tcp:three-cats.database.windows.net,1433;Initial Catalog=three-cats;Persist Security Info=False;User ID=MisterVovan;Password=DpVvm~~~~;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;")
                            .Options;

                        using var context = new PurchasesContext(options);
                        context.Purchases.AddRange(purchases);
                        context.SaveChanges();

                        purchases.Clear();
                    }

                }

                archive.Dispose();
                Console.WriteLine(file);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Text;

namespace Pumps
{
    class GetFromFtp
    {
        const string @base = "ftp://fz223free:fz223free@ftp.zakupki.gov.ru/";

        public static void Run()
        {
            try
            {
                var directories = Directories();
                foreach (var directory in directories)
                {
                    var s = Files(directory);
                    foreach (var file in s.Where(f => f.file.Contains("orderClause")))
                    {
                        DownloadFile(file.directory, file.file);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
            }
        }

        static void DownloadFile(string directory, string file)
        {
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{@base}out/{directory}/{file}");

            request.CachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.CacheIfAvailable);

            request.Method = WebRequestMethods.Ftp.DownloadFile;
            request.KeepAlive = false;
            request.UseBinary = true;
            request.UsePassive = true;

            using FtpWebResponse response = (FtpWebResponse)request.GetResponse();
            using Stream responseStream = response.GetResponseStream();
            using var fileStream = File.OpenWrite(@$"C:\Temp\ftp\{file}");
            responseStream.CopyTo(fileStream);
        }

        static (string directory, string file)[] Files(string directory)
        {
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{@base}out/{directory}");
            request.Method = WebRequestMethods.Ftp.ListDirectoryDetails;

            request.KeepAlive = false;
            request.UseBinary = true;
            request.UsePassive = true;


            using FtpWebResponse response = (FtpWebResponse)request.GetResponse();
            using Stream responseStream = response.GetResponseStream();
            using StreamReader reader = new StreamReader(responseStream);

            var content = reader.ReadToEnd();
            var lines = content.Split(Environment.NewLine);
            return lines.Select(l => (directory, l.Split(' ').Last())).ToArray();
        }

        static string[] Directories()
        {
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{@base}out");
            request.Method = WebRequestMethods.Ftp.ListDirectoryDetails;


            //request.Credentials = new NetworkCredential("maruthi", "******");
            request.KeepAlive = false;
            request.UseBinary = true;
            request.UsePassive = true;


            using FtpWebResponse response = (FtpWebResponse)request.GetResponse();
            using Stream responseStream = response.GetResponseStream();
            using StreamReader reader = new StreamReader(responseStream);

            var content = reader.ReadToEnd();
            var lines = content.Split(Environment.NewLine);
            return lines.Select(l => l.Split(' ').Last()).ToArray();
        }
    }
}

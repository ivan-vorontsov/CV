using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Figures.Helper;

namespace Figures
{
    public static class BlobTriggerCSharp
    {
        [FunctionName("BlobTriggerCSharp")]
        public static async Task Run(Stream myBlob, 
            string name, 
            CloudBlockBlob outputBlob, ILogger log) {
            log.LogInformation($"C# Blob Trigger" +
                $" function Processed blob\n Name: {name} \n" +
                $"Size: {myBlob.Length} Bytes");

            var width = 100;
            var height = 200;
            var encoder = new PngEncoder();
            using (var output = new MemoryStream())
            using (Image<Rgba32> image = Image.Load(myBlob))
            {
                image.Mutate(x => x.Resize(width, height));
                image.Save(output, encoder);
                output.Position = 0;
                await outputBlob.UploadFromStreamAsync(output);
            }
        }
    }

    public static class HttpTriggerCSharp
    {
        [FunctionName("HttpTriggerCSharp")]
        public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            int customerId = Convert.ToInt32(req.Query["customerId"]);
            return (ActionResult)new OkObjectResult(
                SqlClientHelper.GetData(customerId));
        }
    }
}

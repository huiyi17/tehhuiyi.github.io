using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using KindredUnited.Models;

namespace KindredUnited.Services
{
    public class AnalyzeImageService
    {
        public async Task<AnalyzeObjectModel> MakeRequest(string imageFilePath, string subscriptionKey, string endPoint)
        {
            AnalyzeObjectModel responeData = new AnalyzeObjectModel();
            try
            {
                HttpClient client = new HttpClient();

                // Request headers.
                client.DefaultRequestHeaders.Add(
                    "Ocp-Apim-Subscription-Key", subscriptionKey);
                // Request parameters.
                string requestParameters = "visualFeatures=Categories,Description,Objects,Tags";

                // Assemble the URI for the REST API Call.
                string uri = endPoint + "analyze" + "?" + requestParameters;

                HttpResponseMessage response;


                // Request body. Posts a locally stored JPEG image.
                byte[] byteData = GetImageAsByteArray(imageFilePath);

                using (ByteArrayContent content = new ByteArrayContent(byteData))
                {
                    // In this example, I have uses content type "application/octet-stream".
                    // Alternatively, you can use are "application/json or multipart/form-data".
                    content.Headers.ContentType =
                        new MediaTypeHeaderValue("application/octet-stream");

                    // Make the REST API call and wating for response.
                    response = await client.PostAsync(uri, content);
                }

                // Get and read the JSON response.
                string result = await response.Content.ReadAsStringAsync();

                //Do further process if response successfully.
                if (response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        responeData = JsonConvert.DeserializeObject<AnalyzeObjectModel>(result);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("\n" + e.Message);
            }
            return responeData;
        }
        internal static byte[] GetImageAsByteArray(string imageFilePath)
        {
            using (FileStream fileStream =
                new FileStream(imageFilePath, FileMode.Open, FileAccess.Read))
            {
                BinaryReader binaryReader = new BinaryReader(fileStream, System.Text.Encoding.UTF8);
                return binaryReader.ReadBytes((int)fileStream.Length);
            }
        }
    }
}
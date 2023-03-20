using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using KindredUnited.Models;
using KindredUnited.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Security.Claims;

namespace KindredUnited.Controllers
{
    public class CheckquestController : Controller
    {
        private const string subscriptionKey = "0d7af552cce6469999a42e0383d1edd9";
        private string image = "";
        private static readonly List<VisualFeatureTypes> features =
            new List<VisualFeatureTypes>()
        {
            VisualFeatureTypes.Categories, VisualFeatureTypes.Description,
            VisualFeatureTypes.Faces, VisualFeatureTypes.ImageType,
            VisualFeatureTypes.Tags
        };



        [HttpGet("api/analyze")]
         
        public async Task<ImageAnalysis> AnalyzeRemoteAsync()
        {
            ComputerVisionClient computerVision = new ComputerVisionClient(
    new ApiKeyServiceClientCredentials(subscriptionKey),
    new System.Net.Http.DelegatingHandler[] { });
            var a = "https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=%5B2584%2C1722%5D&w=5168&h=2706&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F38%2F2019%2F03%2F12225158%2Fshutterstock_219591568.jpg";
            //var a = "https://bit.ly/2CI9I53";
            computerVision.Endpoint = "https://southeastasia.api.cognitive.microsoft.com/";



            ImageAnalysis analysis =
                await computerVision.AnalyzeImageAsync(a, features);
            DisplayResults(analysis, a);


            return analysis;
        }

        [HttpGet("api/analyze2")]

        public async Task<ImageAnalysis> AnalyzeRemoteAsync2()
        {
            ComputerVisionClient computerVision = new ComputerVisionClient(
    new ApiKeyServiceClientCredentials(subscriptionKey),
    new System.Net.Http.DelegatingHandler[] { });
            var a = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeT5r9IvSN5a9gSsWf4-3Irpv9VeKnFaqS8Q&usqp=CAU";
            //var a = "https://bit.ly/2CI9I53";
            //var a = "https://img.global.news.samsung.com/global/wp-content/uploads/2015/07/Watermark_Inside_Title-Image_0708_v1.jpg";
            //var a = image;
            //var a = Path.Combine(Environment.CurrentDirectory, $"wwwroot\\exercise2\\{picture.FileName}");
            computerVision.Endpoint = "https://southeastasia.api.cognitive.microsoft.com/";



            ImageAnalysis analysis =
                await computerVision.AnalyzeImageAsync(a, features);
            DisplayResults(analysis, a);


            return analysis;
        }

        [HttpGet("api/analyze3")]

        public async Task<ImageAnalysis> AnalyzeRemoteAsync3()
        {
            ComputerVisionClient computerVision = new ComputerVisionClient(
    new ApiKeyServiceClientCredentials(subscriptionKey),
    new System.Net.Http.DelegatingHandler[] { });
            //var a = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeT5r9IvSN5a9gSsWf4-3Irpv9VeKnFaqS8Q&usqp=CAU";
            //var a = "https://bit.ly/2CI9I53";
            var a = "https://img.global.news.samsung.com/global/wp-content/uploads/2015/07/Watermark_Inside_Title-Image_0708_v1.jpg";
            //var a = image;
            //var a = Path.Combine(Environment.CurrentDirectory, $"wwwroot\\exercise2\\{picture.FileName}");
            computerVision.Endpoint = "https://southeastasia.api.cognitive.microsoft.com/";



            ImageAnalysis analysis =
                await computerVision.AnalyzeImageAsync(a, features);
            DisplayResults(analysis, a);


            return analysis;
        }

        [HttpGet("api/analyze4")]

        public async Task<ImageAnalysis> AnalyzeRemoteAsync4()
        {
            ComputerVisionClient computerVision = new ComputerVisionClient(
    new ApiKeyServiceClientCredentials(subscriptionKey),
    new System.Net.Http.DelegatingHandler[] { });
            //var a = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeT5r9IvSN5a9gSsWf4-3Irpv9VeKnFaqS8Q&usqp=CAU";
            var a = "https://bit.ly/2CI9I53";
            //var a = "https://img.global.news.samsung.com/global/wp-content/uploads/2015/07/Watermark_Inside_Title-Image_0708_v1.jpg";
            //var a = image;
            //var a = Path.Combine(Environment.CurrentDirectory, $"wwwroot\\exercise2\\{picture.FileName}");
            computerVision.Endpoint = "https://southeastasia.api.cognitive.microsoft.com/";



            ImageAnalysis analysis =
                await computerVision.AnalyzeImageAsync(a, features);
            DisplayResults(analysis, a);


            return analysis;
        }


        private static void DisplayResults(ImageAnalysis analysis, string imageUri)
        {
            Console.WriteLine(imageUri);
            if (analysis.Description.Captions.Count != 0)
            {
                Console.WriteLine(analysis.Description.Captions[0].Text + "\n");
            }
            else
            {
                Console.WriteLine("No description generated.");
            }
        }

        public IActionResult uploadphoto()
        {
            return View("uploadphoto");
        }

        public IActionResult uploadphoto2()
        {
            return View("uploadphoto2");
        }


        public IActionResult uploadphoto3()
        {
            return View("uploadphoto3");
        }

        public IActionResult uploadphoto4()
        {
            return View("uploadphoto4");
        }

        [HttpPost("api/addpoint")]
        //[HttpPost]
        public IActionResult addpoint(Family f)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int points = f.Points + 5;
            /*string sql2 = @"SELECT ";
            string update2 = String.Format(sql2, userid, f.Points);

            DBUtl.ExecSQL(update2);*/

            string sql = @"UPDATE Family  
                              SET Points = {1} 
                            WHERE OwnerId='{0}'";
            string update = String.Format(sql, userid, points);

            if (DBUtl.ExecSQL(update) == 1)
            {
                return Ok(0);
            }
            else
            {
                return Ok(1);
            }
        }

        [HttpPost("api/uploadphoto")]
        public IActionResult uploadphoto(Checkquest check,IFormFile photo)
        {

            string userid = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            string picfilename = DoPhotoUpload(check.Photo);
            //image = picfilename;

            string sql = @"INSERT INTO Checkquest(CheckedPic, OwnerId) 
                            VALUES('{0}','{1}')";

            string insert = String.Format(sql, picfilename, userid);
            if (DBUtl.ExecSQL(insert) == 1)
            {
                return Ok(0);
            }
            else
            {
                return Ok(1);
            }
        }

        private string DoPhotoUpload(IFormFile photo)
        {
            string fext = Path.GetExtension(photo.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "checkquest/" + fname);
            using (FileStream fs = new FileStream(fullpath, FileMode.Create))
            {
                photo.CopyTo(fs);
            }
            return fname;
        }

        private IWebHostEnvironment _env;
        public CheckquestController(IWebHostEnvironment environment)
        {
            _env = environment;
        }

        






    }
}
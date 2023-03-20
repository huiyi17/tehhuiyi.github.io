using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using KindredUnited.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace KindredUnited.Controllers
{

    public class IoTDeviceController : Controller
    {
       
   

        public IActionResult Index()
        {
            return View();
        }

        //private string DoPhotoUpload(IFormFile photo)
        //{
        //    string fext = Path.GetExtension(photo.FileName);
        //    string uname = Guid.NewGuid().ToString();
        //    string fname = uname + fext;
        //    string fullpath = Path.Combine(_env.WebRootPath, "photos/" + fname);
        //    using (FileStream fs = new FileStream(fullpath, FileMode.Create))
        //    {
        //        photo.CopyTo(fs);
        //    }
        //    return fname;
        //}

     
        //[Route("api/iotdevice/photos")]
        //public IActionResult UploadPhoto(IFormFile photos)
        //{
        //    try
        //    {
        //        string fext = Path.GetExtension(photos.FileName);
        //        string uname = Guid.NewGuid().ToString();
        //        string fname = uname + fext;
        //        string fullpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/photos", fname);
        //        //string fullpath = Path.Combine(_env.WebRootPath, "photos/" + fname);
        //        using (FileStream fs = new FileStream(fullpath, FileMode.Create))
        //        {
        //            photos.CopyTo(fs);
        //            fs.Close();
        //        }
        //        var outcome = new
        //        {
        //            filename = fname,
        //            Result = true
        //        };
        //        return Json(outcome);
        //    }
        //    catch(Exception e)
        //    {
        //        return BadRequest(e);
        //    }
         
        //    }
        

        //private IWebHostEnvironment _env;
        //public IoTDeviceController(IWebHostEnvironment environment)
        //{

        //    _env = environment;
        //}
    }
}

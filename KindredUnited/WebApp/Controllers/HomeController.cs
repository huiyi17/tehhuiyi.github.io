using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KindredUnited.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

namespace KindredUnited.Controllers
{
   public class HomeController : Controller
   {
      public IActionResult Index()
      {
            //var random = new Random();
            //int value = random.Next(1,10);

            //List<Recommendation> dbs = DBUtl.GetList<Recommendation>("SELECT descr FROM Recommendation WHERE RecId = " + value);

            List<Models.Person> person = DBUtl.GetList<Models.Person>("SELECT * FROM Person");
            return View(person);
      }
   }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KindredUnited.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace KindredUnited.Controllers
{
   public class DashboardController : Controller
   {
      [Authorize]
      public IActionResult Index()
      {
          
            return View();
      }
   }
}

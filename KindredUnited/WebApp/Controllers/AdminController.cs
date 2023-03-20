using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KindredUnited.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KindredUnited.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        
        [Authorize(Roles = "admin")]
        public IActionResult Users()
        {
            List<AppUser> list = DBUtl.GetList<AppUser>("SELECT * FROM AppUser");
            return View(list);
        }
    }
}

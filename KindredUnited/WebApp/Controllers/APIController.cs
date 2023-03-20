using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using KindredUnited.Models;
using KindredUnited.Services;
using System.Data;

namespace KindredUnited.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class APIController : ControllerBase
    {

        private IAuthService _usvc;
        private IDBService _dbsvc;

        public APIController(IAuthService userService,
                               IDBService dbService)
        {
            _usvc = userService;
            _dbsvc = dbService;
        }



        [AllowAnonymous]
        [HttpGet("AllRoles")]
        public ActionResult<IEnumerable<string>> GetAllRoles()
        {
            DataTable dt = _dbsvc.GetTable("SELECT DISTINCT UserRole FROM AppUser");
            List<String> result = dt
               .AsEnumerable()
               .Select(row => new String((String)row["UserRole"]))
               .ToList();

            return result;
        }

        [Authorize]
        [HttpGet("AllUserIds")]
        public ActionResult<IEnumerable<string>> GetAllUsers()
        {
            DataTable dt = _dbsvc.GetTable("SELECT DISTINCT UserId FROM AppUser");
            List<String> result = dt
               .AsEnumerable()
               .Select(row => new String((String)row["UserId"]))
               .ToList();

            return result;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AppUser userParam)
        {
            var user = _usvc.Authenticate(userParam.UserId, userParam.UserPw);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user.Token);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("GetAllUsers")]
        public IActionResult GetAll()
        {
            var users = _usvc.GetAll();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var user = _usvc.GetById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        //[AllowAnonymous]
        //[Route("achivement/{id}")]
        //[HttpGet]
        //public IActionResult AchievementDisplay(int id)
        //{
        //    string sql = @"SELECT F.OwnerId AS FamilyName, F.FamilyPic, F.Statement, A.AchieveName, A.AchievePic FROM Achievement A INNER JOIN FamilyHasAchievement FHA ON FHA.AchieveID = A.AchieveID INNER JOIN Family F ON F.FamilyId = FHA.FamilyId WHERE F.FamilyId = {0}";
        //    List<FamilyAchievement2> fa = DBUtl.GetList<FamilyAchievement2>(sql, id+1);
        //    if (fa.Count == 0)
        //    {
        //        string message = "There are no achievement unlocked for this family.";
        //        return Ok(message);
        //    }
        //    else
        //    {

        //        return Ok(fa);
        //    }
        //}


    }

    /*public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }*/
}

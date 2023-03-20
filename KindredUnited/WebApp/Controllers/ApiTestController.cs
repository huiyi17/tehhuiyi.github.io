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
    public class ApiTestController : Controller
    {
        // For Testing Purposes

        private IConfiguration _config;
        private IWebHostEnvironment _env;

        public ApiTestController(IConfiguration Configuration, IWebHostEnvironment environment)
        {
            _config = Configuration;
            _env = environment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> SignIn(string uid, string pwd)
        {

            var endpoint = _config["WebAPI:EndPoint"] + "/login/authenticate";
            using (var client = new HttpClient())
            {
                //client.DefaultRequestHeaders.Add("UserId", "mary");
                //client.DefaultRequestHeaders.Add("Password", "secret0");


                var template = "{{\"UserId\" : \"{0}\", \"Password\" : \"{1}\" }}";
                var json = String.Format(template, uid, pwd);
                var response = await client.PostAsync(endpoint, new StringContent(json, Encoding.UTF8, "application/json"));

                //dynamic obj = response.Content.ReadAsAsync<ExpandoObject>().Result;
                //HttpContext.Session.SetString("JWT", (String)obj);

                String token = await response.Content.ReadAsStringAsync();
                TempData["Msg"] = token;

                if (!token.Contains("password is incorrect"))
                {
                    HttpContext.Session.SetString("JWT", token);
                }
                else
                {
                    HttpContext.Session.SetString("JWT", "");
                }

            }

            return await Task.Run(() => View());
            //return await Task.Run(() => RedirectToAction("Main"));
        }

        public async Task<IActionResult> Main()
        {
            try
            {
                var list = await GrabData();
                return await Task.Run(() => View("list", list));
            }
            catch (Exception ex)
            {
                TempData["Message"] = ex.Message;
                return await Task.Run(() => View("list", new List<AppUser>()));
            }
        }

        private async Task<List<AppUser>> GrabData()
        {
            var endpoint = _config["WebAPI:EndPoint"] + "/login/GetAllUsers";
            string accessToken = HttpContext.Session.GetString("JWT");
            using (var client = new HttpClient())
            {
                //  HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
                var responses = await client.GetStringAsync(endpoint);
                List<AppUser> list = JsonConvert.DeserializeObject<List<AppUser>>(responses);
                return list;
            }
        }

        //Riski API Test

        //[AllowAnonymous]
        //[Route("api/admin/person")]
        //public IActionResult List()
        //{
        //    List<Person> list = DBUtl.GetList<Person>("SELECT * FROM Person");
        //    return Json(list);
        //}

        //[AllowAnonymous]
        //[Route("api/admin/all")]
        //public IActionResult List2()
        //{
        //    AllModel a = new AllModel();
        //    a.EmoT = DBUtl.GetList<Emotion>("SELECT * FROM Emotion");
        //    a.UsersT = DBUtl.GetList<Users>("SELECT * FROM Users");
        //    a.PersonT = DBUtl.GetList<Person>("SELECT * FROM Person");
        //    a.FaceT = DBUtl.GetList<Face>("SELECT * FROM Face");
        //    a.FamT = DBUtl.GetList<Family>("SELECT * FROM Family");
        //    a.ActT = DBUtl.GetList<Activity>("SELECT * FROM Activity");
        //    a.JournalT = DBUtl.GetList<Journal>("SELECT * FROM Journal");
        //    a.QuestT = DBUtl.GetList<Quest>("SELECT * FROM Quest");
        //    a.RecommendationT = DBUtl.GetList<Recommendation>("SELECT * FROM Recommendation");
        //    a.InsClaimT = DBUtl.GetList<InsClaim>("SELECT * FROM InsClaim");
        //    return Json(a);
        //}

        //[Route("api/admin/createfam")]
        //[HttpPost]
        //public IActionResult PostFam([FromBody] Family fam)
        //{
        //    if (fam == null)
        //    {
        //        return BadRequest();
        //    }

        //    string sqlInsert = @"INSERT INTO Family(familyID, familyName) VALUES('{0}','{1}')";
        //    if (DBUtl.ExecSQL(sqlInsert, fam.familyID, fam.familyName) == 1)
        //        return Ok();
        //    else
        //        return BadRequest(new { Message = DBUtl.DB_Message });
        //}

        //[Route("api/admin/create")]
        //[HttpPost]
        //public IActionResult CreateUserFlutter([FromBody] Users usr)
        //{
        //    if (usr == null)
        //    {
        //        return BadRequest();
        //    }

        //    string sqlInsert = @"INSERT INTO Users(userName, userPw, firstName, lastName, relationship, familyID, faceID, role_name) 
        //                        VALUES('{0}', HASHBYTES('SHA1','{1}'), '{2}', '{3}','{4}', '{5}', '{6}', '{7}')";
        //    if (DBUtl.ExecSQL(sqlInsert, usr.userName, usr.userPw, usr.firstName, usr.lastName, usr.relationship, usr.familyID, usr.faceID, usr.role_name) == 1)
        //        return Ok();
        //    else
        //        return BadRequest(new { Message = DBUtl.DB_Message });
        //}

        [Route("api/insemotion")]
        [HttpPost("{query}")]
        public IActionResult InsertEmotion(string query)
        {
            if (query == null || !query.Contains("jpeg") || !query.Contains(",") || !query.Contains("-") )
            {
                var world = "hello";
                return Json(world);
            }
            else
            {
                string faceid = "";
                string photoname = "";
                string emotions = "";
                string[] diffemotions;
                string[] array = query.Split("/");
                double anger = 0.00;
                double contempt = 0.00;
                double disgust = 0.00;
                double fear = 0.00;
                double happiness = 0.00;
                double neutral = 0.00;
                double sadness = 0.00;
                double surprise = 0.00;
                string dt = DateTime.Now.ToString("MM/dd/yyyy H:mm");



                for (int i=0; i < array.Length; i++)
                {
                    if (array[i].Contains("jpeg"))
                    {
                        photoname = array[i];

                    }
                    else if (array[i].Contains(","))
                    {
                         emotions = array[i];
                         diffemotions = emotions.Split(",");
                         anger = float.Parse(diffemotions[0]);
                         contempt = float.Parse(diffemotions[1]);
                         disgust = float.Parse(diffemotions[2]);
                         fear = float.Parse(diffemotions[3]);
                         happiness = float.Parse(diffemotions[4]);
                         neutral = float.Parse(diffemotions[5]);
                         sadness = float.Parse(diffemotions[6]);
                        surprise = float.Parse(diffemotions[7]);
                    }
                    else if(array[i].Length == 36)
                    {
                        faceid = array[i];
                    }
                    else
                    {
                        return BadRequest("Wrong");
                    }
                }
              

                string sqlInsert = @"INSERT INTO Emotion(PictureFileName, TimeTaken, anger, contempt, disgust, fear, happiness, neutral, sadness, surprise, FaceId) VALUES('{0}', '{1}', {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, '{10}')";
                if (DBUtl.ExecSQL(sqlInsert, photoname, dt, anger, contempt, disgust, fear, happiness, neutral, sadness, surprise, faceid ) == 1)
                    return Json("NICE!");
                else
                    return BadRequest(new { Message = DBUtl.DB_Message });
            }
        }

        [Route("api/getemo")]
        [HttpGet]
        public IActionResult GetEmotion()
        {
            return Json("Version 22");
        }


        [AllowAnonymous]
        [Route("api/iotdevice/photos")]
        [HttpPost]
        public IActionResult UploadPhoto(IFormFile photos)
        {
            string msg = "";
            string fext = Path.GetExtension(photos.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "photos/" + fname);
            try
            {
                using (var fs = System.IO.File.Create(fullpath))
                {
                    photos.CopyTo(fs);
                    fs.Flush();
                    fs.Close();
                     
                }
            }
            catch (Exception ex)
            {
                msg += ex.Message;
            }
            
            var outcome = new
            {
                version = "version 23",
                error = msg,
                filename = fname,
                Result = true
            };
            return Json(outcome);



        }

        [AllowAnonymous]
        [Route("api/myjournal/photo")]
        [HttpPost]
        public IActionResult UploadPhoto2(IFormFile photos)
        {
            string msg = "";
            string fext = Path.GetExtension(photos.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "journal\\" + fname);
            try
            {
                using (var fs = System.IO.File.Create(fullpath))
                {
                    photos.CopyTo(fs);
                    fs.Flush();
                    fs.Close();

                }
            }
            catch (Exception ex)
            {
                msg += ex.Message;
            }

            var outcome = new
            {
                version = "version 22",
                error = msg,
                filename = fullpath,
                Result = true
            };
            return Json(outcome);



        }

        [AllowAnonymous]
        [Route("api/checkquest/photos")]
        [HttpPost]
        public IActionResult UploadPhoto3(IFormFile photos)
        {
            string msg = "";
            string fext = Path.GetExtension(photos.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "checkquest\\" + fname);
            try
            {
                using (var fs = System.IO.File.Create(fullpath))
                {
                    photos.CopyTo(fs);
                    fs.Flush();
                    fs.Close();

                }
            }
            catch (Exception ex)
            {
                msg += ex.Message;
            }

            var outcome = new
            {
                version = "version 22",
                error = msg,
                filename = fullpath,
                Result = true
            };
            return Json(outcome);



        }

        //[AllowAnonymous]
        //[Route("api/admin/photos")]
        //public IActionResult UploadPhoto(IFormFile photo)
        //{
        //    string fext = Path.GetExtension(photo.FileName);
        //    string uname = Guid.NewGuid().ToString();
        //    string fname = uname + fext;
        //    string fullpath = Path.Combine(_env.WebRootPath, "photos/" + fname);
        //    using (FileStream fs = new FileStream(fullpath, FileMode.Create))
        //    {
        //        photo.CopyTo(fs);
        //        fs.Close();
        //    }
        //    var outcome = new
        //    {
        //        filename = fname,
        //        Result = true
        //    };
        //    return Json(outcome);
        //}

        //public ApiTestController(IWebHostEnvironment environment)
        //{
        //    _env = environment;
        //}

        //[AllowAnonymous]
        //[Route("api/achievement")]
        //[HttpGet]
        //public IActionResult AchievementDisplay()
        //{
        //    string sql = @"SELECT F.FamilyId, F.OwnerId, F.FamilyPic, A.AchievePic FROM Achievement A INNER JOIN FamilyHasAchievement FHA ON FHA.AchieveID = A.AchieveID INNER JOIN Family F ON F.FamilyId = FHA.FamilyId";
        //    List<FamilyAchievement2> fa = DBUtl.GetList<FamilyAchievement2>(sql);


        //    return Ok(fa);

        //}

        //[AllowAnonymous]
        //[Route("api/achievement2")]
        //[HttpGet]
        //public IActionResult AchievementDisplay2()
        //{
        //    string sql = @"SELECT FamilyId, OwnerId, FamilyPic FROM Family";
        //    List<Fam1> fa = DBUtl.GetList<Fam1>(sql);


        //    return Ok(fa);

        //}

        //[AllowAnonymous]
        //[Route("api/achievement3")]
        //[HttpGet]
        //public IActionResult AchievementDisplay3()
        //{
        //    string sql = @"SELECT F.FamilyId, A.AchievePic  FROM Achievement A INNER JOIN FamilyHasAchievement FHA ON FHA.AchieveID = A.AchieveID INNER JOIN Family F ON F.FamilyId = FHA.FamilyId";
        //    List<Fam2> fa = DBUtl.GetList<Fam2>(sql);


        //    return Ok(fa);

        //}

        //[AllowAnonymous]
        //[Route("api/activity")]
        //[HttpGet]
        //public IActionResult Activity()
        //{
        //    string sql = @"SELECT * FROM Activity";
        //    List<Activity> fa = DBUtl.GetList<Activity>(sql);


        //    return Ok(fa);

        //}

        [AllowAnonymous]
        [Route("api/activity2")]
        [HttpGet]
        public IActionResult Activity2()
        {
            string sql = @"SELECT * FROM Activity2";
            List<Activity2> fa = DBUtl.GetList<Activity2>(sql);


            return Ok(fa);

        }

        [AllowAnonymous]
        [Route("api/daily")]
        [HttpGet]
        public IActionResult daily()
        {
            List<GamificationQuest2> questeasy =
               DBUtl.GetList<GamificationQuest2>("SELECT QuestId, QuestName FROM GamificationQuest2 WHERE SwapType = 'Daily'"); //FLOOR(RAND(QuestId)*(20-1+1)+1), QuestName, QuestType

            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {
                Random random = new Random();
                int num = random.Next(0, questeasy.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questeasy[num]);
                }
            }
            return Ok(questList);

        }

        [AllowAnonymous]
        [Route("api/weekly")]
        [HttpGet]
        public IActionResult weekly()
        {
            List<GamificationQuest2> questeasy =
               DBUtl.GetList<GamificationQuest2>("SELECT QuestId, QuestName FROM GamificationQuest2 WHERE SwapType = 'Weekly'"); //FLOOR(RAND(QuestId)*(20-1+1)+1), QuestName, QuestType

            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {
                Random random = new Random();
                int num = random.Next(0, questeasy.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questeasy[num]);
                }
            }
            return Ok(questList);

        }

        [AllowAnonymous]
        [Route("api/apidemo")]
        [HttpGet]

        public IActionResult apidemo()
        {
            String sql = @"SELECT * FROM Journal";
            List<Journal> j = DBUtl.GetList<Journal>(sql);

            return Ok(j);
        }
















    }
}

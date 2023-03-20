using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using KindredUnited.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using Newtonsoft.Json;

namespace KindredUnited.Controllers
{
    public class FamilyController : Controller
    {
        public FamilyController(IWebHostEnvironment environment)
        {
            _env = environment;
            client = new FaceClient(
               new ApiKeyServiceClientCredentials(faceApiKey),
               new System.Net.Http.DelegatingHandler[] { });
            client.Endpoint = "https://southeastasia.api.cognitive.microsoft.com";
        }

        private readonly IFaceClient client;

        private IWebHostEnvironment _env;

        public Guid faceid;

        const string faceApiKey = "0d7af552cce6469999a42e0383d1edd9";
        const string endPoint = "https://southeastasia.api.cognitive.microsoft.com";
        private readonly string personGroupId = "kunited";

        //-----------------------------

        [Authorize]
        public IActionResult MyFamily()
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string sql1 = $"SELECT PersonId FROM Person WHERE UserId = '{userid}'";
            List<Models.Person> ds1 = DBUtl.GetList<Models.Person>(sql1);
            string sql2 = $"SELECT FamilyId FROM PersonHasFamily WHERE PersonId = '{ds1[0].PersonId}'";
            List<PersonHasFamily> ds2 = DBUtl.GetList<PersonHasFamily>(sql2);
            string sql3 = $"SELECT F.FamilyId, P.PersonId, F.FamilyName, P.FirstName, P.LastName, F.FamilyPic, F.Points, F.Statements, PHF.Relationship FROM Person P INNER JOIN PersonHasFamily PHF ON PHF.PersonId = P.PersonId INNER JOIN Family F ON F.FamilyId = PHF.FamilyId WHERE F.FamilyId = {ds2[0].FamilyId}";
            List<MemInFamSY> list = DBUtl.GetList<MemInFamSY>(sql3);
            return View(list);
        }

        [Authorize]
        public IActionResult Create()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult Create(Family fam, IFormFile photo)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("Index");
            }
            else
            {
                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string picfilename = DoPhotoUpload(fam.Photo);

                string insert =
                   @"INSERT INTO Family(FamilyName, FamilyPic, Statements, Points, OwnerId) VALUES
                 ('{0}', '{1}', '{2}', 0, '{3}')";
                if (DBUtl.ExecSQL(insert, fam.FamilyName, picfilename, fam.Statements, userid) == 1)
                {
                    ViewData["Message"] = "Family Creation Success!";
                    ViewData["MsgType"] = "success";


                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return View("MyFamily");
            }
        }

        private string DoPhotoUpload(IFormFile photo)
        {
            string fext = Path.GetExtension(photo.FileName);
            string picGuid = Guid.NewGuid().ToString();
            var fname = picGuid + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "family/" + fname);
            using (FileStream fs = new FileStream(fullpath, FileMode.Create))
            {
                photo.CopyTo(fs);
            }
            return fname;
        }


        [Authorize]
        public IActionResult Update(int FamilyId)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            string sql = @"SELECT * FROM Family 
                         WHERE FamilyId={0} AND OwnerId='{1}'";

            string select = String.Format(sql, FamilyId, userid);

            List<Family> famList = DBUtl.GetList<Family>(select);
            if (famList.Count == 1)
            {
                Family fam = famList[0];
                return View(fam);
            }
            else
            {
                TempData["Message"] = "Family Record does not exist";
                TempData["MsgType"] = "warning";
                return RedirectToAction("Edit");
            }
        }

        [Authorize]
        [HttpPost]
        public IActionResult Update(Family fam)
        {
            ModelState.Remove("Photo");  // No Need to Validate "Photo"
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "danger";
                return View("Update", fam);
            }
            else
            {
                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string sql = @"UPDATE Family  
                              SET FamilyName='{2}', Statements='{3}'
                            WHERE FamilyId={0} AND OwnerId='{1}'";



                string update = String.Format(sql, fam.FamilyId, userid,
                                              fam.FamilyName,
                                              fam.Statements);
                if (DBUtl.ExecSQL(update) == 1)
                {
                    TempData["Message"] = "Family Updated";
                    TempData["MsgType"] = "success";
                }
                else
                {
                    TempData["Message"] = DBUtl.DB_Message;
                    TempData["MsgType"] = "danger";
                }
                return RedirectToAction("Index");
            }
        }


        [Authorize]
        public IActionResult Delete(int FamilyId)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            string sql = @"SELECT * FROM Family 
                         WHERE FamilyId={0} AND OwnerId='{1}'";

            string select = String.Format(sql, FamilyId, userid);

            DataTable ds = DBUtl.GetTable(select);
            if (ds.Rows.Count != 1)
            {
                TempData["Message"] = "Family Record does not exist";
                TempData["MsgType"] = "warning";
            }
            else
            {
                string photoFile = ds.Rows[0]["FamilyPic"].ToString();
                string fullpath = Path.Combine(_env.WebRootPath, "family/" + photoFile);
                System.IO.File.Delete(fullpath);

                int res = DBUtl.ExecSQL(String.Format("DELETE FROM Family WHERE FamilyId={0}", FamilyId));
                if (res == 1)
                {
                    TempData["Message"] = "Family Record Deleted";
                    TempData["MsgType"] = "success";
                }
                else
                {
                    TempData["Message"] = DBUtl.DB_Message;
                    TempData["MsgType"] = "danger";
                }
            }
            return RedirectToAction("Index");
        }

        [Authorize]
        public IActionResult EditPerson(Guid pid)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            string sql = $"SELECT * FROM Person WHERE PersonId = '{pid}'";

            List<Models.Person> pList = DBUtl.GetList<Models.Person>(sql);
            if (pList.Count == 1)
            {
                Models.Person pp = pList[0];
                return View(pp);
            }
            else
            {
                TempData["Message"] = "Person Record does not exist";
                TempData["MsgType"] = "warning";
                return View();
            }
        }

        [Authorize]
        [HttpPost]
        public IActionResult EditPerson(Models.Person p)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "danger";
                return View("EditPerson", p);
            }
            else
            {
                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string sql = $"UPDATE Person SET FirstName='{p.FirstName}', LastName='{p.LastName}', Email = '{p.Email}', Gender = '{p.Gender}'  WHERE PersonId='{p.PersonId}'";
                if (DBUtl.ExecSQL(sql) == 1)
                {
                    TempData["Message"] = "Person Updated";
                    TempData["MsgType"] = "success";
                    return RedirectToAction("MyFamily", "Family");
                }
                else
                {
                    TempData["Message"] = DBUtl.DB_Message;
                    TempData["MsgType"] = "danger";
                }
                return RedirectToAction("EditPerson", "Family");
            }
        }

        [Authorize]
        public IActionResult CreatePerson(int fid)
        {
            TempData["fid"] = fid;
            return View();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePerson(Models.Person p, IFormFile photo)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("Person");
            }
            else
            {


                var pID = Guid.NewGuid();
                Random rnd = new Random();
                int number = rnd.Next(1, 10000);
                var appuser = "ABC" + number.ToString();
                var fID = TempData["fid"];
                string insertAU = @"INSERT INTO AppUser(UserId, UserPw, UserRole) VALUES ('{0}', HASHBYTES('SHA1', 'abc'), 'user')";

                string insert = @"INSERT INTO Person(PersonId, FirstName, LastName, Email, Gender, UserId) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}')";
                string insert2 = @"SET IDENTITY_INSERT Family OFF; SET IDENTITY_INSERT PersonHasFamily ON; INSERT INTO PersonHasFamily(FamilyId, PersonId, Relationship) VALUES ({0},'{1}','{2}');";
                if (DBUtl.ExecSQL(insertAU, appuser) == 1) {
                    if (DBUtl.ExecSQL(insert, pID, p.FirstName, p.LastName, p.Email, p.Gender, appuser) == 1)
                    {
                        string outcome = await UploadP(photo, pID, p.FirstName);

                        ViewData["Message"] = "Person Creation Success!";
                        ViewData["MsgType"] = "success";

                        if (DBUtl.ExecSQL(insert2, fID, pID, p.Relationship) == 1)
                        {
                            return RedirectToAction("Index", "Dashboard");
                        }

                    }
                 }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return RedirectToAction("Index","Dashboard");
            }
        }

        [HttpPost]
        public async Task<string> UploadP(IFormFile file, Guid kupid, string fname)
        {
            var uploads = Path.Combine(_env.WebRootPath, "uploads");
            string filePath = Guid.NewGuid() + Path.GetExtension(file.FileName);
            filePath = Path.Combine(uploads, filePath);
            if (file.Length > 0)
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            var personId = await AddPerson(fname, kupid);
            var persistedfaceid = await AddFaceToPerson(personId, filePath);
            var output = await Train();
            if (output == "Succeeded")
            {
                string sql = @"INSERT INTO Face(FaceId, PersonId) VALUES('{0}','{1}')";

                string insert = String.Format(sql, personId, kupid);
                if (DBUtl.ExecSQL(insert) == 1)
                {
                    TempData["Msg"] = "Face successfully registered!";
                    return "Success";
                }
                else
                {
                    ViewData["Msg"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                    return "Failed1";
                }
            }
            return "Failed2";
        }

        [HttpGet("api/addperson/{name}/{kupid}")]
        public async Task<Guid> AddPerson(string name, Guid kupid)
        {
            string content = string.Empty;
            Guid contentguid;
            using (var httpClient = new HttpClient())
            {
                using (var request = new HttpRequestMessage(new HttpMethod("POST"), "https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/kunited/persons"))
                {
                    request.Headers.TryAddWithoutValidation("Ocp-Apim-Subscription-Key", "0d7af552cce6469999a42e0383d1edd9");

                    request.Content = new StringContent("{\"name\": \"" + name + "\", \"userData\": \"" + kupid + "\"}");
                    request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

                    var response = await httpClient.SendAsync(request);
                    content = response.Content.ReadAsStringAsync().Result;
                    PersonId pid = JsonConvert.DeserializeObject<PersonId>(content);
                    contentguid = pid.personId;
                    return contentguid;
                }
            }
        }

        [HttpGet("api/addface/{pid}/{pic}")]
        public async Task<string> AddFaceToPerson(Guid pid, string pic)
        {
            //string fullpath = Path.Combine(_env.WebRootPath, pic /*@"photos/addface/test_batch.jpg"*/);
            using (Stream fs = System.IO.File.OpenRead(pic))
            {
                PersistedFace persistedfaceid = await client.PersonGroupPerson.AddFaceFromStreamAsync(personGroupId, pid, fs);
                //foreach (var f in persistedfaceid)
                //{
                //    content.Add(f.FaceId.ToString());
                //}
                var content = persistedfaceid.PersistedFaceId.ToString();
                return content;
            }

        }

        [HttpGet("api/train")]
        public async Task<string> Train()
        {
            TrainingStatus trainingStatus = null;
            await client.PersonGroup.TrainAsync(personGroupId);
            await Task.Delay(1000);
            trainingStatus = await client.PersonGroup.GetTrainingStatusAsync(personGroupId);
            var outcome = trainingStatus.Status.ToString();
            return outcome;

        }

    }

}

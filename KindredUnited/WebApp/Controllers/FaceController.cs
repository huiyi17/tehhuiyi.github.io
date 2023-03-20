using System.Security.Claims;
using System.Threading.Tasks;
using KindredUnited.Models;
using System.Web;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Net.Http.Headers;
using System;
using System.Collections.Generic;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Diagnostics;
using Microsoft.Rest;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Google.Apis.Util;

namespace KindredUnited.Controllers
{
    public class FaceController : Controller
    {
        //personGroupId = kunited || name = KUnitedGroup

        public FaceController(IWebHostEnvironment environment)
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


        //------------------------------------------------------------------------------

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
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
            var uid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            List<Models.Person> list = DBUtl.GetList<Models.Person>("SELECT PersonId FROM Person WHERE UserId='"+ uid +"'");
            Guid kupid = list[0].PersonId;
            if (list.Count == 1)
            {
                var personId = await AddPerson(uid, kupid);
                var persistedfaceid = await AddFaceToPerson(personId, filePath);
                var output = await Train();
                if (output == "Succeeded")
                {
                    string sql = @"INSERT INTO Face(FaceId, PersonId) VALUES('{0}','{1}')";

                    string insert = String.Format(sql, personId, kupid);
                    if (DBUtl.ExecSQL(insert) == 1)
                    {
                        TempData["Msg"] = "Face successfully registered!";
                        return RedirectToAction("Index", "Dashboard");
                    }
                    else
                    {
                        ViewData["Msg"] = DBUtl.DB_Message;
                        ViewData["MsgType"] = "danger";
                        return View("Upload");
                    }
                }
            }
            return RedirectToAction("Index", "Home");
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
                        return "Failed";
                    }
                }
            return "Failed";
        }


        //------------------------------------------------------------------------------

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

                    request.Content = new StringContent("{\"name\": \""+ name+ "\", \"userData\": \"" + kupid + "\"}");
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


        [HttpGet("api/detIden/{path}/{title}/{desc}")]
        public async Task<string> DetectIdentify(string path, string title, string desc)
        {
            IList<FaceAttributeType> faceAttributes = new FaceAttributeType[] {FaceAttributeType.Emotion};
            List<Models.EmotionJournal> emotion = new List<Models.EmotionJournal>();
            string fullpath = Path.Combine(_env.WebRootPath, path);
            using (Stream fs = System.IO.File.OpenRead(fullpath))
            {
                var faces = await client.Face.DetectWithStreamAsync(fs, true, false, faceAttributes);
                var faceIds = faces.Select(face => face.FaceId).ToArray();
                var results = await client.Face.IdentifyAsync(faceIds.OfType<Guid>().ToList(), personGroupId);
                for(var a = 0; a < results.Count; a++)
                {
                    var candidateId = results[a].Candidates[0].PersonId;
                    var faceatt = faces[a].FaceAttributes.Emotion;
                    var person = await client.PersonGroupPerson.GetAsync(personGroupId, candidateId);
                    emotion.Add(new Models.EmotionJournal
                    {
                        PictureFileName = fullpath,
                        anger = faceatt.Anger,
                        contempt = faceatt.Contempt,
                        disgust = faceatt.Disgust,
                        fear = faceatt.Fear,
                        happiness = faceatt.Happiness,
                        neutral = faceatt.Neutral,
                        sadness = faceatt.Sadness,
                        surprise = faceatt.Surprise,
                        Title = title,
                        Description = desc
                    }) ;
                }
            }
            var ljson = System.Text.Json.JsonSerializer.Serialize(emotion);
            return ljson;
        }

        //For JX
        [AllowAnonymous]
        [Route("api/detidenemo")]
        [HttpGet]
        public async Task<string> detidenTest() 
        {
            //Data from journal DB
            string select = String.Format(@"SELECT * FROM Journal");
            List<JournalForApi> list = DBUtl.GetList<JournalForApi>(select);

            //Data for DetIdenEmo
            IList<FaceAttributeType> faceAttributes = new FaceAttributeType[] { FaceAttributeType.Emotion };
            List<EmotionJournal> emotion = new List<EmotionJournal>();

            foreach (var data in list)
            {
                string fullpath = Path.Combine(_env.WebRootPath, $"journal\\{data.JournalPic}");
                using (Stream fs = System.IO.File.OpenRead(fullpath))
                {
                    var faces = await client.Face.DetectWithStreamAsync(fs, true, false, faceAttributes);
                    var faceIds = faces.Select(face => face.FaceId).ToArray();
                    var results = await client.Face.IdentifyAsync(faceIds.OfType<Guid>().ToList(), personGroupId);
                    for (var a = 0; a < results.Count; a++)
                    {
                        if (results[a].Candidates.Count != 0)
                        {
                            if (results[a].Candidates[0].Confidence > 0.75)
                            {
                                var candidateId = results[a].Candidates[0].PersonId;
                                var faceatt = faces[a].FaceAttributes.Emotion;
                                var person = await client.PersonGroupPerson.GetAsync(personGroupId, candidateId);

                                var personid = Guid.Parse(person.UserData);
                                string selectpid = String.Format($"SELECT * FROM Person WHERE PersonId = '{personid}'");
                                List<Models.Person> listpid = DBUtl.GetList<Models.Person>(selectpid);
                                string fullname = listpid[0].FirstName + listpid[0].LastName;

                                emotion.Add(new EmotionJournal
                                {
                                    PictureFileName = data.JournalPic,
                                    anger = faceatt.Anger,
                                    contempt = faceatt.Contempt,
                                    disgust = faceatt.Disgust,
                                    fear = faceatt.Fear,
                                    happiness = faceatt.Happiness,
                                    neutral = faceatt.Neutral,
                                    sadness = faceatt.Sadness,
                                    surprise = faceatt.Surprise,
                                    Title = data.JournalTitle,
                                    Description = data.JournalDescr,
                                    Fullname = fullname
                                });
                            }
                        }
                    }
                }
            }
            var ljson = System.Text.Json.JsonSerializer.Serialize(emotion);
            return ljson;
        }

        [HttpGet("api/listface")]
        public async Task<List<ListAsync>> ListRegistered()
        {
            List<ListAsync> lface = new List<ListAsync>();
            var results = await client.PersonGroupPerson.ListAsync(personGroupId);
            await Task.Delay(1000);
            for (var a = 0; a < results.Count; a++)
            {
                var faceid = results[a].PersonId;
                var name = results[a].Name;
                var personid = results[a].UserData;

                lface.Add(new ListAsync
                {
                    FaceId = faceid,
                    Name = name,
                    PersonId = Guid.Parse(personid)
                });
            }
            return lface;

        }

        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ListAllFace()
        {
            List<ListAsync> lFaces = await ListRegistered();
            string select = "SELECT * FROM Person";
            List<Models.Person> list = DBUtl.GetList<Models.Person>(select);
            foreach(var pid in list)
            {
                foreach(var fpid in lFaces)
                {
                    if (fpid.PersonId == pid.PersonId)
                    {
                        fpid.FirstName = pid.FirstName;
                        fpid.LastName = pid.LastName;
                    }

                }
            }
            return View(lFaces);
        }

        [Authorize(Roles = "admin")]
        public IActionResult ListAllUF()
        {
            string sql = "SELECT P.UserId, P.FirstName, P.LastName, F.FamilyId, F.FamilyName, F.OwnerId, PHF.Relationship FROM Person P INNER JOIN PersonHasFamily PHF ON PHF.PersonId = P.PersonId INNER JOIN Family F ON F.FamilyId = PHF.FamilyId";
            List<MemberInFamily> list = DBUtl.GetList<MemberInFamily>(sql);
            return View(list);
        }

        public IActionResult ListMIF()
        {
            string sql = @"SELECT P.FirstName, P.LastName, F.FamilyName, F.FamilyPic, F.Points, F.Statements, PHF.Relationship 
FROM Person P
INNER JOIN PersonHasFamily PHF ON PHF.PersonId = P.PersonId
INNER JOIN Family F ON F.FamilyId = PHF.FamilyId";
            List<MemInFamSY> list = DBUtl.GetList<MemInFamSY>(sql);
            return View(list);
        }
    }
};

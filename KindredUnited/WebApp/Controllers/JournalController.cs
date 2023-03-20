using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using KindredUnited.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Security.Claims;


namespace KindredUnited.Controllers
{
    public class JournalController : Controller
    {
        //private IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment _env;
        //public JournalController(IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment)
        //{
        //    _httpContextAccessor = httpContextAccessor;
        //    _env = environment;
        //}

        public JournalController(IWebHostEnvironment environment)
        {
            _env = environment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult MyJournal()
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string select = String.Format(@"SELECT * FROM Journal 
                                          WHERE UserId = '{0}'", userid);
            List<Journal> list = DBUtl.GetList<Journal>(select);
            return View("MyJournal", list);
        }

        [Authorize]
        public IActionResult Create()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult Create(Journal journal, IFormFile photo)
        {

            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("Create");
            }
            else
            {
                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string picfilename = DoPhotoUpload(journal.Photo);

                string sql = @"INSERT INTO Journal(JournalTitle, JournalDescr, 
                                            JournalPic, UserId) 
                            VALUES('{0}','{1}','{2}','{3}')";

                string insert = String.Format(sql, journal.JournalTitle, journal.JournalDescr,
                                         picfilename, userid);
                if (DBUtl.ExecSQL(insert) == 1)
                {
                    TempData["Message"] = "Journal Successfully Added.";
                    TempData["MsgType"] = "success";
                    return RedirectToAction("MyJournal");
                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                    return View("Create");
                }
            }
        }

        [Authorize]
        public IActionResult Update(int JournalId)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            string sql = @"SELECT * FROM Journal 
                         WHERE JournalId={0} AND UserId='{1}'";

            string select = String.Format(sql, JournalId, userid);

            List<Journal> lstJournal = DBUtl.GetList<Journal>(select);
            if (lstJournal.Count == 1)
            {
                Journal journal = lstJournal[0];
                return View(journal);
            }
            else
            {
                TempData["Message"] = "Trip Record does not exist";
                TempData["MsgType"] = "warning";
                return RedirectToAction("MyJournal");
            }
        }

        [Authorize]
        [HttpPost]
        public IActionResult Update(Journal journal)
        {
            ModelState.Remove("Photo");  // No Need to Validate "Photo"
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "danger";
                return View("Update", journal);
            }
            else
            {
                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string sql = @"UPDATE Journal  
                              SET JournalTitle='{2}', JournalDescr='{3}'
                            WHERE JournalId={0} AND UserId='{1}'";



                string update = String.Format(sql, journal.JournalId, userid,
                                              journal.JournalTitle,
                                              journal.JournalDescr);
                if (DBUtl.ExecSQL(update) == 1)
                {
                    TempData["Message"] = "Journal Updated";
                    TempData["MsgType"] = "success";
                }
                else
                {
                    TempData["Message"] = DBUtl.DB_Message;
                    TempData["MsgType"] = "danger";
                }
                return RedirectToAction("MyJournal");
            }
        }


        [Authorize]
        public IActionResult Delete(int JournalId)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            string sql = @"SELECT * FROM Journal 
                         WHERE JournalId={0} AND UserId='{1}'";

            string select = String.Format(sql, JournalId, userid);

            DataTable ds = DBUtl.GetTable(select);
            if (ds.Rows.Count != 1)
            {
                TempData["Message"] = "Journal Record does not exist";
                TempData["MsgType"] = "warning";
            }
            else
            {
                string photoFile = ds.Rows[0]["JournalPic"].ToString();
                string fullpath = Path.Combine(_env.WebRootPath, "journal/" + photoFile);
                System.IO.File.Delete(fullpath);

                int res = DBUtl.ExecSQL(String.Format("DELETE FROM Journal WHERE JournalId={0}", JournalId));
                if (res == 1)
                {
                    TempData["Message"] = "Journal Record Deleted";
                    TempData["MsgType"] = "success";
                }
                else
                {
                    TempData["Message"] = DBUtl.DB_Message;
                    TempData["MsgType"] = "danger";
                }
            }
            return RedirectToAction("MyJournal");
        }

        private string DoPhotoUpload(IFormFile photo)
        {
            string fext = Path.GetExtension(photo.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "journal/" + fname);
            using (FileStream fs = new FileStream(fullpath, FileMode.Create))
            {
                photo.CopyTo(fs);
            }
            return fname;
        }
    }
}

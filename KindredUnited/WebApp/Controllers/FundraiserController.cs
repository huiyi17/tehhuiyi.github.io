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
using Telegram.Bot;
using System.Net;
using System.Text;

namespace KindredUnited.Controllers
{
    public class FundraiserController : Controller
    {


        //INDEX
        [AllowAnonymous]
        public IActionResult Index()
        {

            List<Goal> list = DBUtl.GetList<Goal>("SELECT * FROM Goals");
            return View("Index", list);
        }

        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }

        [HttpPost]
        public IActionResult AddGoal(Goal goal, IFormFile photo)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("Add");
            }
            else
            {

                string picfilename = DoPhotoUpload(goal.Photo);

                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

                string sql = @"INSERT INTO Goals ( GName, GDesc, GTotal, GCurr, GPhoto, UserId) VALUES('{0}','{1}', {2}, {3}, '{4}','{5}')";


                string insert = String.Format(sql, goal.GName.EscQuote(), goal.GDesc.EscQuote(), goal.GTotal, goal.GCurr, picfilename, userid);

                if (DBUtl.ExecSQL(insert) == 1)
                {
                    TempData["Message"] = "New Goal Successfully Added!.";
                    TempData["MsgType"] = "Success";
                    return RedirectToAction("Index");
                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "Danger";
                    return View("Add");
                }


            }
        }



        public IActionResult Edit(int id)
        {

            string sql = @"SELECT * FROM Goals WHERE GID = {0}";
            List<Goal> lstGoal = DBUtl.GetList<Goal>(sql, id);

            if (lstGoal.Count == 1)
            {
                return View(lstGoal[0]);
            }
            else
            {
                TempData["Message"] = "Goal record does not exist";
                TempData["MsgType"] = "warning";
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public IActionResult EditGoals(Goal goal)
        {
            ModelState.Remove("GPhoto");

            if (!ModelState.IsValid)
            {

                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "danger";
                return View("Edit", goal);
            }
            else
            {
                string sql = @"UPDATE Goals  
                              SET GName='{1}', GDesc='{2}', GTotal={3},
                                  GCurr={4}
                            WHERE GID={0}";

                string update = String.Format(sql, goal.GID, goal.GName.EscQuote(),
    goal.GDesc.EscQuote(),
    goal.GTotal, goal.GCurr);


                if (DBUtl.ExecSQL(update) == 1)
                {
                    TempData["Message"] = "Updated Goal Details Sucessfully";
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



        public IActionResult Fund(int id)
        {

            string sql = @"SELECT * FROM Goals WHERE GID = {0}";
            List<Goal> lstGoal = DBUtl.GetList<Goal>(sql, id);

            if (lstGoal.Count == 1)
            {
                return View(lstGoal[0]);
            }
            else
            {
                TempData["Message"] = "Goal record does not exist";
                TempData["MsgType"] = "warning";
                return RedirectToAction("Index");
            }
        }

        [Authorize]
        //GOAL FUNDING
        [HttpPost]
        public IActionResult FundGoal(Goal goal)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!ModelState.IsValid)
            {

                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "danger";
                return View("Edit", goal);
            }
            else
            {

                string urlString = "https://api.telegram.org/bot{0}/sendMessage?chat_id={1}&text={2}";
                string apiToken = "1208812261:AAF2_aCr8_GayfDWrZId2wdT5KU6zlgn_H4";
                string chatId = "-1001344952174";
                string text = String.Format("At {0},\n {1} Funded {2:C} to  Goal - \"{3}\" \n Message: {4}", DateTime.Now, userid , goal.GAdd, goal.GName, goal.GMess).Replace("\n", Environment.NewLine);
                urlString = String.Format(urlString, apiToken, chatId, text);
                WebRequest request = WebRequest.Create(urlString);
                Stream rs = request.GetResponse().GetResponseStream();
                StreamReader reader = new StreamReader(rs);
                string line = "";
                StringBuilder sb = new StringBuilder();
                while (line != null)
                {
                    line = reader.ReadLine();
                    if (line != null)
                        sb.Append(line);
                }
                string response = sb.ToString();
                // Do what you want with response


                string sql = @"UPDATE Goals  
                              SET GCurr={1}
                            WHERE GID={0}";

               goal.GCurr = goal.GCurr + goal.GAdd;
                string update = String.Format(sql, goal.GID, goal.GCurr);


                if (DBUtl.ExecSQL(update) == 1)
                {
                    TempData["Message"] = "Goal Funded Sucessfully";
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




        //GOAL DELETION
        [Authorize]
        public IActionResult Delete(int id)
        {
            string userid = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            string sql = @"SELECT * FROM Goals 
                         WHERE GID={0} AND UserId='{1}'";


            DataTable ds = DBUtl.GetTable(sql, id, userid);

            if (ds.Rows.Count != 1)
            {
                TempData["Message"] = "Goal does not exist";
                TempData["MsgType"] = "warning";
            }
            else
            {
                string photoFile = ds.Rows[0]["GPhoto"].ToString();
                string fullpath = Path.Combine(_env.WebRootPath, "goalPic/" + photoFile);
                System.IO.File.Delete(fullpath);

                // TODO: L09 Task 2f - Make unsecure DB delete to secure
                sql = "DELETE FROM Goals WHERE GID={0}";
                int res = DBUtl.ExecSQL(sql, id);
                if (res == 1)
                {
                    TempData["Message"] = "Goal Record Deleted";
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


        private IWebHostEnvironment _env;
        public FundraiserController(IWebHostEnvironment environment)
        {
            _env = environment;
        }


        //Photo Upload Method
        private string DoPhotoUpload(IFormFile photo)
        {
            string fext = Path.GetExtension(photo.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "goalPic/" + fname);
            using (FileStream fs = new FileStream(fullpath, FileMode.Create))
            {
                photo.CopyTo(fs);
            }
            return fname;
        }







    }
}

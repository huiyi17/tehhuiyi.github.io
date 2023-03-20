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
using Microsoft.AspNetCore.DataProtection.KeyManagement;

namespace KindredUnited.Controllers
{
    public class PaymentController : Controller

    {
        //Index
        [AllowAnonymous]
        public IActionResult Index()
        {
            List<Transfer> list = DBUtl.GetList<Transfer>("SELECT * FROM PayFam");
            return View(list);
        }



        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult AddMember(Transfer transfer, IFormFile photo)
        {

            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("Add");
            }

            else
            {

                string picfilename = DoPhotoUpload(transfer.Photo);

                string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);

                string sql = @"INSERT INTO PayFam(Member, Email, Picture, Notes, UserId)
                        VALUES('{0}','{1}','{2}','{3}', '{4}')";
                string insert = String.Format(sql, transfer.Member.EscQuote(), transfer.Email.EscQuote(), picfilename, transfer.Notes.EscQuote(), userid);
                if (DBUtl.ExecSQL(insert) == 1)
                {
                    TempData["Message"] = "New Member Successfully Added.";
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

            string sql = @"SELECT * FROM PayFam WHERE Id = {0}";
            List<Transfer> lstMember = DBUtl.GetList<Transfer>(sql, id);

            if (lstMember.Count == 1)
            {
                return View(lstMember[0]);
            }
            else
            {
                TempData["Message"] = "Member record does not exist";
                TempData["MsgType"] = "warning";
                return RedirectToAction("Index");
            }
        }

        public IActionResult EditMember(Transfer transfer)
        {
            ModelState.Remove("Photo");

            if (!ModelState.IsValid)
            {

                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "danger";
                return View("Edit", transfer);
            }
            else
            {

                string sql = "UPDATE PayFam SET Member = '{1}', Email='{2}', Notes='{3}' WHERE Id={0}";
                string update = string.Format(sql, transfer.Id, transfer.Member.EscQuote(), transfer.Email.EscQuote(), transfer.Notes.EscQuote());

                if (DBUtl.ExecSQL(update) == 1)
                {
                    TempData["Message"] = "Updated Member Details Sucessfully";
                    TempData["MsgType"] = "success";
                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return RedirectToAction("index");


            }
        }
        //[Authorize]
        public IActionResult Delete(int id)
        {
            string userid = User.FindFirstValue(ClaimTypes.NameIdentifier);


            string sql = @"SELECT * FROM PayFam 
                         WHERE Id={0} AND UserId='{1}'";


            DataTable ds = DBUtl.GetTable(sql, id, userid);
            if (ds.Rows.Count != 1)
            {
                TempData["Message"] = "Member Record does not exist";
                TempData["MsgType"] = "warning";
            }
            else
            {
                string photoFile = ds.Rows[0]["picture"].ToString();
                string fullpath = Path.Combine(_env.WebRootPath, "photos/" + photoFile);
                System.IO.File.Delete(fullpath);

                int res = DBUtl.ExecSQL(String.Format("DELETE FROM PayFam WHERE Id={0}", id));
                if (res == 1)
                {
                    TempData["Message"] = "Sucessfully Deleted Member Record";
                    TempData["MsgType"] = "success";
                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }

            }
            return RedirectToAction("Index");
        }







        //Photo Upload Method
        private string DoPhotoUpload(IFormFile photo)
        {
            string fext = Path.GetExtension(photo.FileName);
            string uname = Guid.NewGuid().ToString();
            string fname = uname + fext;
            string fullpath = Path.Combine(_env.WebRootPath, "photos/" + fname);
            FileStream fs = new FileStream(fullpath, FileMode.Create);
            photo.CopyTo(fs);
            fs.Close();
            return fname;
        }
        private IWebHostEnvironment _env;

        public PaymentController(IWebHostEnvironment environment)
        {
            _env = environment;
        }

    }
}


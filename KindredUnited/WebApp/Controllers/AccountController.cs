﻿/*using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using KindredUnited.Models;

namespace KindredUnited.Controllers
{
    public class AccountController : Controller
    {
        private const string LOGIN_SQL =
           @"SELECT * FROM AppUser 
            WHERE UserId = '{0}' 
              AND UserPw = HASHBYTES('SHA1', '{1}')";

        private const string LASTLOGIN_SQL =
           @"UPDATE AppUser SET LastLogin=GETDATE() WHERE UserId='{0}'";

        private const string ROLE_COL = "UserRole";
        private const string NAME_COL = "FirstName";

        private const string REDIRECT_CNTR = "ApiTest";
        private const string REDIRECT_ACTN = "Index";

        private const string LOGIN_VIEW = "Login";

        [AllowAnonymous]
        public IActionResult Login(string returnUrl = null)
        {
            TempData["ReturnUrl"] = returnUrl;
            return View(LOGIN_VIEW);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(AppUser user)
        {
            if (!AuthenticateUser(user.UserId, user.UserPw, out ClaimsPrincipal principal))
            {
                ViewData["Message"] = "Incorrect User ID or Password";
                ViewData["MsgType"] = "warning";
                return View(LOGIN_VIEW);
            }
            else
            {
                HttpContext.SignInAsync(
                   CookieAuthenticationDefaults.AuthenticationScheme,
                   principal,
               new AuthenticationProperties
               {
                   IsPersistent = user.RememberMe
               }); ;

                // Update the Last Login Timestamp of the User
                DBUtl.ExecSQL(LASTLOGIN_SQL, user.UserId);

                if (TempData["returnUrl"] != null)
                {
                    string returnUrl = TempData["returnUrl"].ToString();
                    if (Url.IsLocalUrl(returnUrl))
                        return Redirect(returnUrl);
                }

                return RedirectToAction(REDIRECT_ACTN, REDIRECT_CNTR);
            }
        }

        [Authorize]
        public IActionResult Logoff(string returnUrl = null)
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);
            return RedirectToAction(REDIRECT_ACTN, REDIRECT_CNTR);
        }

        [AllowAnonymous]
        public IActionResult Forbidden()
        {
            return View();
        }

        [Authorize(Roles = "manager")]
        public IActionResult Users()
        {
            List<AppUser> list = DBUtl.GetList<AppUser>("SELECT * FROM AppUser WHERE UserRole='member' ");
            return View(list);
        }

        [Authorize(Roles = "manager")]
        public IActionResult Delete(string id)
        {
            string delete = "DELETE FROM AppUser WHERE UserId='{0}'";
            int res = DBUtl.ExecSQL(delete, id);
            if (res == 1)
            {
                TempData["Message"] = "User Record Deleted";
                TempData["MsgType"] = "success";
            }
            else
            {
                TempData["Message"] = DBUtl.DB_Message;
                TempData["MsgType"] = "danger";
            }

            return RedirectToAction("Users");
        }

        [AllowAnonymous]
        public IActionResult Register()
        {
            return View("Login");
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register(AppUser usr)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("UserRegister");
            }
            else
            {
                string insert =
                   @"INSERT INTO AppUser(UserId, Password, FirstName.LastName, Email,BirthDate,Gender,ProfilePic, UserRole) VALUES
                 ('{0}', HASHBYTES('SHA1', '{1}'), '{2}', '{3}','{4}','{5}','{6}','{7}', 'member')";
                if (DBUtl.ExecSQL(insert, usr.UserId, usr.UserPw, usr.FirstName,usr.LastName, usr.Email) == 1)
                {

                    string template = @"Hi {0},<br/><br/>
                               Welcome to SysADE CHAMBER MUSIC!
                               Your userid is <b>{1}</b> and password is <b>{2}</b>.
                               <br/><br/>Manager";
                    string title = "Registration Successul - Welcome";
                    string message = String.Format(template, (usr.FirstName + usr.LastName), usr.UserId, usr.UserPw);
                    string result;
                    if (EmailUtl.SendEmail(usr.Email, title, message, out result))
                    {
                        ViewData["Message"] = "User Successfully Registered";
                        ViewData["MsgType"] = "success";
                    }
                    else
                    {
                        ViewData["Message"] = result;
                        ViewData["MsgType"] = "warning";
                    }
                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return View("UserRegister");
            }
        }

        [AllowAnonymous]
        public IActionResult VerifyUserID(string userId)
        {
            string select = $"SELECT * FROM AppUser WHERE Userid='{userId}'";
            if (DBUtl.GetTable(select).Rows.Count > 0)
            {
                return Json($"[{userId}] already in use");
            }
            return Json(true);
        }

        private bool AuthenticateUser(string uid, string pw, out ClaimsPrincipal principal)
        {
            principal = null;

            DataTable ds = DBUtl.GetTable(LOGIN_SQL, uid, pw);
            if (ds.Rows.Count == 1)
            {
                principal =
                   new ClaimsPrincipal(
                      new ClaimsIdentity(
                         new Claim[] {
                        new Claim(ClaimTypes.NameIdentifier, uid),
                        new Claim(ClaimTypes.Name, ds.Rows[0][NAME_COL].ToString()),
                        new Claim(ClaimTypes.Role, ds.Rows[0][ROLE_COL].ToString())
                         }, "Basic"
                      )
                   );
                return true;
            }
            return false;
        }

    }
}
*/
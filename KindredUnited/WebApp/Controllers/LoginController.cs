using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using KindredUnited.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace KindredUnited.Controllers
{
    // Login
    public class LoginController : Controller
    {
        //private readonly UserManager<AppUser> _userManager;

        //public LoginController(UserManager<AppUser> userManager)
        //{
        //    _userManager = userManager;
        //}

        private const string LOGIN_SQL =
           @"SELECT * FROM AppUser 
            WHERE UserId = '{0}' 
              AND UserPw = HASHBYTES('SHA1', '{1}')";

        private const string LASTLOGIN_SQL =
           @"UPDATE AppUser SET LastLogin=GETDATE() WHERE UserId='{0}'";

        private const string ROLE_COL = "UserRole";
        private const string NAME_COL = "UserId";

        private const string REDIRECT_CNTR = "Dashboard";
        private const string REDIRECT_ACTN = "Index";

        private const string LOGIN_VIEW = "Login";

        [AllowAnonymous]
        public IActionResult Login(string returnUrl = null)
        {
            TempData["ReturnUrl"] = returnUrl;
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(LoginUser user)
        {
            if (!AuthenticateUser(user.UserId, user.UserPw, out ClaimsPrincipal principal))
            {
                ViewData["Message"] = "Incorrect User ID or Password";
                ViewData["MsgType"] = "warning";
                ViewBag.SuccessMsg = "error";
                return View(LOGIN_VIEW);
            }
            else
            {
                HttpContext.SignInAsync(
                   CookieAuthenticationDefaults.AuthenticationScheme,
                   principal);
                //var a = CollectData();

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
            return RedirectToAction("Login", "Login");
        }

        [AllowAnonymous]
        public IActionResult Forbidden()
        {
            return View("404");
        }

        /*[Authorize(Roles = "manager")]
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
        }*/

        [AllowAnonymous]
        public IActionResult Register()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register(AppUser usr)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View("Register");
            }
            else
            {
                string insert =
                   @"INSERT INTO AppUser(UserId, UserPw, UserRole) VALUES
                 ('{0}', HASHBYTES('SHA1', '{1}'), 'user')";
                if (DBUtl.ExecSQL(insert, usr.UserId, usr.UserPw) == 1)
                {
                    ViewData["Message"] = "User Successfully Registered";
                    ViewData["MsgType"] = "success";

                    TempData["userid"] = usr.UserId;

                    /*if(AuthenticateUser(usr.UserId, usr.UserPw, out ClaimsPrincipal principal))
                    {
                            HttpContext.SignInAsync(
                       CookieAuthenticationDefaults.AuthenticationScheme,
                       principal,
                       new AuthenticationProperties
                       {
                           IsPersistent = usr.RememberMe
                       }); ;

                            // Update the Last Login Timestamp of the User
                            DBUtl.ExecSQL(LASTLOGIN_SQL, usr.UserId);

                            if (TempData["returnUrl"] != null)
                            {
                                string returnUrl = TempData["returnUrl"].ToString();
                                if (Url.IsLocalUrl(returnUrl))
                                    return Redirect(returnUrl);
                            }
                    }*/

                    /*string template = @"Hi {0},<br/><br/>
                               Welcome to Kindred United!
                               Your userid is <b>{1}</b> and password is <b>{2}</b>.
                               <br/><br/>Administrator";
                    string title = "Registration Successful - Welcome";
                    //string message = String.Format(template, (usr.FirstName + usr.LastName), usr.UserId, usr.UserPw);
                    string message = String.Format(template, usr.UserId, usr.UserPw);
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
                    }*/


                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return View("Person");
            }
        }

        [AllowAnonymous]
        public IActionResult VerifyUserID(string userId)
        {
            string select = $"SELECT * FROM AppUser WHERE UserId='{userId}'";
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
                        new Claim(ClaimTypes.Role, ds.Rows[0][ROLE_COL].ToString()),
                        //new Claim(ClaimTypes.Email, ds.Rows[0]["familyID"].ToString())
                         }, CookieAuthenticationDefaults.AuthenticationScheme
                      )
                   );

                //((ClaimsIdentity)principal.Identity).
                //   AddClaims(new[] {
                //   new Claim(ClaimTypes.NameIdentifier,uid
                //   )});

                return true;
            }
            return false;
        }

        //public async Task<string> CollectData()
        //{
        //    AppUser applicationUser = await _userManager.GetUserAsync(User);
        //    return "";
        //}
        //public async Task<ClaimsPrincipal> Identity(AppUser user)
        //{
        //    var principal = await CreateAsync(user);

        //    // Add your claims here
        //    ((ClaimsIdentity)principal.Identity).
        //       AddClaims(new[] {
        // new Claim(ClaimTypes.NameIdentifier,
        //    user.UserId.ToString())
        //    });


        //    return principal;
        //}

        //

        [AllowAnonymous]
        public IActionResult Person()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreatePerson(Person p)
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
                var uID = TempData["userid"];

                string insert =
                   @"INSERT INTO Person(PersonId, ProfilePic, FirstName, LastName, Email, Gender, BirthDate, UserId) VALUES
                 ('{0}', 'null', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}')";
                if (DBUtl.ExecSQL(insert, pID, p.FirstName, p.LastName, p.Email, p.Gender, p.BirthDate, uID) == 1)
                {
                    ViewData["Message"] = "Person Creation Success!";
                    ViewData["MsgType"] = "success";


                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return View("Login");
            }
        }

        [AllowAnonymous]
        public IActionResult NewUser()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult NewUser(NewUser usr)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Message"] = "Invalid Input";
                ViewData["MsgType"] = "warning";
                return View();
            }
            else
            {
                string insert =
                   @"INSERT INTO AppUser(UserId, UserPw, UserRole) VALUES
                 ('{0}', HASHBYTES('SHA1', '{1}'), 'user')";

                string insert2 = @"INSERT INTO Person(UserId) VALUES
                 ('{0}') WHERE Email = '{usr.Email}'";

                if (DBUtl.ExecSQL(insert, usr.UserId, usr.UserPw) == 1 &&
                    DBUtl.ExecSQL(insert2, usr.UserId) == 1)
                {
                    ViewData["Message"] = "User Successfully Registered";
                    ViewData["MsgType"] = "success";

                    TempData["userid"] = usr.UserId;


                }
                else
                {
                    ViewData["Message"] = DBUtl.DB_Message;
                    ViewData["MsgType"] = "danger";
                }
                return View("Login");
            }
        }

        [AllowAnonymous]
        public IActionResult VerifyEmail(string email)
        {
            string select = $"SELECT * FROM Person WHERE Email ='{email}' AND UserId IS NULL";
            if (DBUtl.GetTable(select).Rows.Count == 0)
            {
                return Json($"[{email}] is not registered or You have a UserId registered");
            }
            return Json(true);
        }

        [Authorize]
        public IActionResult Emotions()
        {
            string pid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var finding = DBUtl.GetList<AppUser>(@"SELECT * FROM Person WHERE UserId={0}", pid);
            string personid = finding[0].ToString();
            var finding2 = DBUtl.GetList<Family>(@"SELECT * FROM Family WHERE PersonId={0}", personid);
            string fid = finding2[0].ToString();
            List<EmotionTable> a = DBUtl.GetList<EmotionTable>("SELECT u.FirstName, u.LastName, e.pictureFileName, e.emotionID,e.timeTaken, e.anger, e.contempt, e.disgust, e.fear, e.happiness, e.neutral, e.sadness, e.surprise, f.familyID FROM PersonHasFamily u INNER JOIN Family f ON f.FamilyId = u.FamilyId INNER JOIN Person p ON p.PersonId = u.PersonId INNER JOIN Face fa ON fa.PersonId = p.PersonId INNER JOIN EmotionTable e ON e.faceID = fa.FaceId WHERE u.FamilyId = '{0}' ", fid);
            return View(a);
        }

        }
}

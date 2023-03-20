using Google.Apis.Calendar.v3.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;

namespace KindredUnited.Models
{
   public class AppUser
   {
      [Required(ErrorMessage = "Please enter a User ID")] 
      /*[Remote(action: "VerifyUserID", controller: "Login")]*/
      public string UserId { get; set; }

        [Required(ErrorMessage = "Please enter a Password")]
        /*[StringLength(20, MinimumLength = 5, ErrorMessage = "Password must be 5 characters or more")]*/
        public string UserPw { get; set; }

        [Compare("UserPw", ErrorMessage = "Passwords do not match")]
        public string UserPw2 { get; set; }
        /*public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public string Gender { get; set; }
        public string ProfilePic { get; set; }*/
        public string UserRole { get; set; }
        public DateTime LastLogin { get; set; }
        public string Token { get; set; }
        /*public string CSPersonID { get; set; }*/

        public Boolean RememberMe { get; set; }

        public string familyID { get; set; }
    }
}

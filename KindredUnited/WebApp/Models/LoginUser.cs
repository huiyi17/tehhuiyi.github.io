using Google.Apis.Calendar.v3.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;

namespace KindredUnited.Models
{
   public class LoginUser
    {
      [Required(ErrorMessage = "Please enter a User ID")] 
      public string UserId { get; set; }

        [Required(ErrorMessage = "Please enter a Password")]
        public string UserPw { get; set; }
        public string UserRole { get; set; }
        public DateTime LastLogin { get; set; }
        public string Token { get; set; }

        public Boolean RememberMe { get; set; }
   }
}

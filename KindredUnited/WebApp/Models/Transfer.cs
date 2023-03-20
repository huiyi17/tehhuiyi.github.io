using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace KindredUnited.Models
{

        public class Transfer
    {
        public int Id { get; set; }
        public string Member { get; set; }

        public string Email { get; set; }
        public string Picture { get; set; }

        public IFormFile Photo { get; set; }

        public string Notes { get; set; }


    }
}


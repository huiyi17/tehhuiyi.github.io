    using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace KindredUnited.Models
{
    public class Journal
    {
        public int JournalId { get; set; }

        [Required(ErrorMessage = "Please enter Title")]
        public string JournalTitle { get; set; }

        [Required(ErrorMessage = "Please enter Description")]
        public string JournalDescr { get; set; }

        [Required(ErrorMessage = "Please enter Photo")]
        public IFormFile Photo { get; set; }
        public string JournalPic { get; set; }
    }
}

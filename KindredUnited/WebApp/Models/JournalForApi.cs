    using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace KindredUnited.Models
{
    public class JournalForApi
    {
        public int JournalId { get; set; }
        public string JournalTitle { get; set; }
        public string JournalDescr { get; set; }
        public string JournalPic { get; set; }
        public string UserId { get; set; }
    }
}

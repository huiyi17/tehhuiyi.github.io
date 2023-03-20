using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class Checkquest
    {
        public int CheckedId { get; set; }

        public IFormFile Photo { get; set; }

        public string CheckedPic { get; set; }

        public string OwnerId { get; set; }
    }
}

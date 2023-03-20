using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class Questphoto
    {
        public int QuestphotoId { get; set; }

        public IFormFile Photo { get; set; }

        public string QuestPic { get; set; }
    }
}

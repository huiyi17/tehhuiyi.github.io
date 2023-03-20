using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class Achievement
    {
        public int AchieveID { get; set; }


        public string AchieveName { get; set; }

        public IFormFile Photo { get; set; }

        public string AchievePic { get; set; }
    }
}

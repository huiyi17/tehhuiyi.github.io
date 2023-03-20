using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class FamilyAchievement
    {
        public int FamilyId { get; set; }

        public string OwnerId { get; set; }

        public IFormFile Photo { get; set; }

        public string FamilyPic { get; set; }

        public string AchieveName { get; set; }

        public IFormFile Photo1 { get; set; }

        public string AchievePic { get; set; }

    }
}

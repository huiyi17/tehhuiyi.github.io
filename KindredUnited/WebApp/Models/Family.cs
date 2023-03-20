using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class Family
    {
        public int FamilyId { get; set; }
        public string FamilyName { get; set; }
        public string FamilyPic { get; set; }
        public string Statements { get; set; }
        public int Points { get; set; }
        public string OwnerId { get; set; }

        public IFormFile Photo { get; set; }
    }
}

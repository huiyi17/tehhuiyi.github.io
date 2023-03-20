using KindredUnited.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class MemInFamSY
    {
        public string FamilyName { get; set; }
        public string FamilyPic { get; set; }
        public string Statements { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Relationship { get; set; }
        public int Points { get; set; }
        public int FamilyId { get; set; }
        public Guid PersonId { get; set; }
    }
}

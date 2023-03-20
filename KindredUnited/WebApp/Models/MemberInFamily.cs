using KindredUnited.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class MemberInFamily
    {
        public int FamilyId { get; set; }
        public string FamilyName { get; set; }
        public string OwnerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Relationship { get; set; }
        public string UserId { get; set; }

        public Guid faceID { get; set; }

    }
}

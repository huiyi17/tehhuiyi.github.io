using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class PersonHasFamily
    {
        public int FamilyId { get; set; }
        public Guid PersonId { get; set; }
        public string Relationship { get; set; }
}
}

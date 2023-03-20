using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class Person_in_Photo
    {
        public int RecogniseId  { get; set; }
        public string PhotoId { get; set; }
        public string MemberId { get; set; }
        public string Name { get; set; }
        public int FamilyId { get; set; }
    }
}

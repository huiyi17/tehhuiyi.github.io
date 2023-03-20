using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace KindredUnited.Models
{
    public class Person
    {
        public Guid PersonId { get; set; }
        public string ProfilePic { get; set; }

        [Required(ErrorMessage = "Please enter a FirstName")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Please enter a LastName")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Please enter a Email")]
        public string Email { get; set; }

        public string Gender { get; set; }

        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }
        public string CSPersonId { get; set; }
        public string UserId { get; set; }
        public string Relationship { get; set; }
        public IFormFile Photo { get; set; }
    }
}

using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace KindredUnited.Models
{
    public class Goal
    {
        public int GID { get; set; }

        public string GName { get; set; }

        public string GDesc { get; set; }

        public decimal GTotal { get; set; }

        public decimal GCurr { get; set; }

        public IFormFile Photo { get; set; }
        public string GPhoto { get; set; }

        public string GMess { get; set; }

        public decimal GAdd { get; set; }

        public string UserId { get; set; }

    }
}


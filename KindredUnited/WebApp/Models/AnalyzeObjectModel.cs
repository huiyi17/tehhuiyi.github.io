using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class AnalyzeObjectModel
    {
        public List<Category> Categories { get; set; }
        public List<Tags> Tags { get; set; }
        public string RequestId { get; set; }
        public Description Description { get; set; }
        public MetaData MetaData { get; set; }
    }

    public class Description
    {
        public List<string> Tags { get; set; }
        public List<Caption> Captions { get; set; }
    }

    public class Caption
    {
        public string Text { get; set; }
        public double Confidence { get; set; }
    }
    public class Category
    {
        public string Name { get; set; }
        public double Score { get; set; }
    }
    public class Tags
    {
        public string Name { get; set; }
        public double Confidence { get; set; }
        public string Hint { get; set; }
    }
    public class MetaData
    {
        public string Width { get; set; }
        public string Height { get; set; }
        public string Format { get; set; }
    }


}
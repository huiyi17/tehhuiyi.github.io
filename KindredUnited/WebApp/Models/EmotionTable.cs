using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindredUnited.Models
{
    public class EmotionTable
    {
        public int emotionID { get; set; }
        public string pictureFileName { get; set; }
        public DateTime timeTaken { get; set; }
        public double anger { get; set; }
        public double contempt { get; set; }
        public double disgust { get; set; }
        public double fear { get; set; }
        public double happiness { get; set; }
        public double neutral { get; set; }
        public double sadness { get; set; }
        public double surprise { get; set; }
        public Guid faceID { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string familyID { get; set; }
    }
}


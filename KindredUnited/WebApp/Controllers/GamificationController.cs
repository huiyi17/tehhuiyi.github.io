using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using KindredUnited.Models;
using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.Security.Claims;

namespace KindredUnited.Controllers
{
    public class GamificationController : Controller
    {
        public IActionResult Activity()
        {
            List<Activity2> lstact =
               DBUtl.GetList<Activity2>("SELECT * FROM Activity2 ORDER BY Act2Name");
            return View("Activity",lstact);
        }

        public IActionResult Display(int id)
        {
            string sql = String.Format(@"SELECT * FROM Activity2 
                                       WHERE Act2ID = {0}", id);
            List<Activity2> lstact = DBUtl.GetList<Activity2>(sql);
            if (lstact.Count == 0)
            {
                TempData["Message"] = $"Activity #{id} not found";
                TempData["MsgType"] = "warning";
                return RedirectToAction("Activity");
            }
            else
            {
                // Get the FIRST element of the List
                Activity2 cdd = lstact[0];
                return View("Display",cdd);
            }
        }

        public IActionResult Achievement()
        {
            List<Family> lstachieve =
                DBUtl.GetList<Family>("SELECT FamilyId, FamilyPic, OwnerId FROM Family ORDER BY FamilyId");
            return View("Achievement",lstachieve);
        }

        public IActionResult AchievementDisplay(int id)
        {
            string sql = @"SELECT F.OwnerId AS FamilyName, A.AchieveName, A.AchievePic FROM Achievement A INNER JOIN FamilyHasAchievement FHA ON FHA.AchieveID = A.AchieveID INNER JOIN Family F ON F.FamilyId = FHA.FamilyId WHERE F.FamilyId = {0}";
            List<FamilyAchievement> fa = DBUtl.GetList<FamilyAchievement>(sql, id);
            if (fa.Count == 0)
            {
                TempData["Message"] = $"There are no achievement unlocked for this family.";
                TempData["MsgType"] = "warning";
                return RedirectToAction("AchievementDisplay0");
            }
            else
            {
                

                return View(fa);
            }
        }

        public IActionResult AchievementDisplay0()
        {
            return View();
        }


        public IActionResult Podium()
        {


            return View();


        }

        public IActionResult Competition()
        {

            DataTable dt = DBUtl.GetTable("SELECT * FROM Family ORDER BY Points DESC");
            return View("Competition", dt.Rows);


        }

        public IActionResult checkquest()
        {
            return View("checkquest");
        }

        public IActionResult checkquest2()
        {
            return View("checkquest2");
        }

        public IActionResult dayweek()
        {
            return View("dayweek");
        }

        public IActionResult MonthlyQuest()
        {
            return View("MonthlyQuest");
        }
        public IActionResult WeeklyQuest()
        {
            return View("WeeklyQuest");
        }

        public IActionResult DailyQuest()
        {
            List<GamificationQuest2> quest =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE SwapType = 'Daily'");
            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {

                Random random = new Random();
                int num = random.Next(0, quest.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(quest[num]);
                }


            }
            return View("DailyQuest", questList);
        }

        


        public IActionResult QuestMonthlyeasy()
        {

            List<GamificationQuest2> questeasy =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE QuestType = 'Easy' AND SwapType = 'Monthly'"); //FLOOR(RAND(QuestId)*(20-1+1)+1), QuestName, QuestType

            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {

                Random random = new Random();
                int num = random.Next(0, questeasy.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questeasy[num]);
                }


            }

            return View("QuestMonthlyeasy",questList);

        }

        public IActionResult QuestMonthlymedium()
        {
            List<GamificationQuest2> questmedium =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE QuestType = 'Medium' AND SwapType = 'Monthly'");
            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {

                Random random = new Random();
                int num = random.Next(0, questmedium.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questmedium[num]);
                }


            }
            return View("QuestMonthlymedium", questList);

        }

        public IActionResult QuestMonthlyhard()
        {
            List<GamificationQuest2> questhard =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE QuestType = 'Hard' AND SwapType = 'Monthly'");
            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {

                Random random = new Random();
                int num = random.Next(0, questhard.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questhard[num]);
                }


            }
            return View("QuestMonthlyhard", questList);

        }

        public IActionResult QuestWeeklyeasy()
        {

            List<GamificationQuest2> questeasy =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE SwapType = 'Weekly'"); //FLOOR(RAND(QuestId)*(20-1+1)+1), QuestName, QuestType

            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 4; i++)
            {

                Random random = new Random();
                int num = random.Next(0, questeasy.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questeasy[num]);
                }


            }

            return View("QuestWeeklyeasy", questList);

        }

        public IActionResult QuestWeeklymedium()
        {
            List<GamificationQuest2> questmedium =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE QuestType = 'Medium' AND SwapType = 'Weekly'");
            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 3; i++)
            {

                Random random = new Random();
                int num = random.Next(0, questmedium.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questmedium[num]);
                }


            }
            return View("QuestWeeklymedium", questList);

        }

        public IActionResult QuestWeeklyhard()
        {
            List<GamificationQuest2> questhard =
               DBUtl.GetList<GamificationQuest2>("SELECT * FROM GamificationQuest2 WHERE QuestType = 'Hard' AND SwapType = 'Weekly'");
            List<GamificationQuest2> questList = new List<GamificationQuest2>();
            List<int> exist = new List<int>();
            for (int i = 0; questList.Count < 3; i++)
            {

                Random random = new Random();
                int num = random.Next(0, questhard.Count);
                if (!exist.Contains(num))
                {
                    exist.Add(num);
                    questList.Add(questhard[num]);
                }


            }
            return View("QuestWeeklyhard", questList);

        }

        




        private void UploadFile(IFormFile ufile, string fname)
        {
            string fullpath = Path.Combine(_env.WebRootPath, fname);
            using (var fileStream = new FileStream(fullpath, FileMode.Create))
            {
                ufile.CopyToAsync(fileStream);
            }
        }

        private IWebHostEnvironment _env;
        public GamificationController(IWebHostEnvironment environment)
        {
            _env = environment;
        }

        public IActionResult Chart()
        {
            PrepareData(1);
            ViewData["Chart"] = "bar";
            ViewData["Title"] = "Ranking Summary";
            ViewData["ShowLegend"] = "false";
            List<Competition> lstcomp =
                DBUtl.GetList<Competition>("SELECT * FROM Competition ORDER BY ComID");
            return View("Chart", lstcomp);
        }

        private void PrepareData(int x)
        {
            int[] datacomp = new int[] { 0, 0, 0, 0, 0 };

            List<Competition> list = DBUtl.GetList<Competition>("SELECT * FROM Competition");
            foreach (Competition comp in list)
            {
                datacomp[CalcGrade(comp.Totalpoints)]++;

            }

            string[] colors = new[] { "cyan", "lightgreen", "yellow", "pink", "lightgrey" };
            string[] grades = new[] { "A", "B", "C", "D", "F" };
            ViewData["Legend"] = "User Amount";
            ViewData["Colors"] = colors;
            ViewData["Labels"] = grades;
            if (x == 1)
                ViewData["Data"] = datacomp;

        }

        private int CalcGrade(int point)
        {
            if (point >= 2000) return 0;
            else if (point >= 1000) return 1;
            else if (point >= 500) return 2;
            else if (point >= 200) return 3;
            else return 4;
        }

    }
}

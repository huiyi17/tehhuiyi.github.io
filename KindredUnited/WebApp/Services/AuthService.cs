using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Text;
using KindredUnited.Models;

namespace KindredUnited.Services
{
   public interface IAuthService
   {
      AppUser Authenticate(string username, string password);
      IEnumerable<AppUser> GetAll();
      AppUser GetById(string id);
   }

   public class AuthService : IAuthService
   {
      private static IConfiguration config =
         new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build()
            .GetSection("EncryptSettings");

      private static readonly string SECRET = config.GetValue<String>("SecretKey");

      private static IDBService _dbs = new DBService();

      private const string LOGIN_SQL =
         @"SELECT * FROM AppUser 
            WHERE UserId = '{0}' 
              AND UserPw = HASHBYTES('SHA1', '{1}')";

      private const string LASTLOGIN_SQL =
         @"UPDATE AppUser SET LastLogin=GETDATE() WHERE UserId='{0}'";

      public AppUser Authenticate(string uid, string upw)
      {
         List<AppUser> list = _dbs.GetList<AppUser>(LOGIN_SQL, uid, upw);
         if (list.Count != 1)
            return null;

         // Update the Last Login Timestamp of the User
         _dbs.ExecSQL(LASTLOGIN_SQL, uid);

         var user = list[0];

         // Generate JWT Token
         var tokenHandler = new JwtSecurityTokenHandler();
         var key = Encoding.ASCII.GetBytes(SECRET);
         var tokenDescriptor = new SecurityTokenDescriptor
         {
            Subject =
               new ClaimsIdentity(
                  new Claim[]
                  {
                    new Claim(ClaimTypes.Name, user.UserId),
                    new Claim(ClaimTypes.Role, user.UserRole)
                  }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials =
               new SigningCredentials(
                  new SymmetricSecurityKey(key),
                  SecurityAlgorithms.HmacSha256Signature)
         };
         var token = tokenHandler.CreateToken(tokenDescriptor);
         user.Token = tokenHandler.WriteToken(token);

         return user;
      }

      public IEnumerable<AppUser> GetAll()
      {
         return _dbs.GetList<AppUser>("SELECT * FROM AppUser");
      }

      public AppUser GetById(string userid)
      {
         List<AppUser> list = _dbs.GetList<AppUser>("SELECT * FROM AppUser WHERE UserId='{0}'", userid);
         if (list.Count == 1)
            return list[0];
         else
            return null;
      }
   }
}
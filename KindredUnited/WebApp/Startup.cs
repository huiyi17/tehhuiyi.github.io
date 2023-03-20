using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using KindredUnited.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace KindredUnited
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }
      
      public IConfiguration Configuration { get; }

      private static IConfiguration config =
         new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build()
            .GetSection("EncryptSettings");

      private static readonly string SECRETKEY = config.GetValue<String>("SecretKey");

      // This method gets called by the runtime. Use this method to add services to the container.
      public void ConfigureServices(IServiceCollection services)
      {
         services.AddCors();

         //services.AddAuthentication(
         //   x =>
         //   {
         //      x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
         //      x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
         //   })

         //.AddJwtBearer(
         //   x =>
         //   {
         //      x.RequireHttpsMetadata = false;
         //      x.SaveToken = true;
         //      x.TokenValidationParameters = new TokenValidationParameters
         //      {
         //         ValidateIssuerSigningKey = true,
         //         IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SECRETKEY)),
         //         ValidateIssuer = false,
         //         ValidateAudience = false
         //      };
         //   });


         services.AddSession();
         services.AddMvc(options => options.EnableEndpointRouting = false);

         services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

         services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                 .AddCookie(options =>
                 {
                    options.LoginPath = "/Login/Login";
                    options.AccessDeniedPath = "/Login/Forbidden";
                 });
         
         services.AddControllers();

         // configure DI for application services
         services.AddScoped<IAuthService, AuthService>();
         services.AddScoped<IDBService, DBService>();
         services.Configure<IdentityOptions>(options =>
             options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier);

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();
         }
         app.UseStaticFiles();
         app.UseSession();  
         app.UseHttpsRedirection();
         app.UseRouting();
         app.UseAuthentication();
         app.UseAuthorization();
            //app.UseMvcWithDefaultRoute();
            app.UseMvc(
                  routes =>
                  {
                      routes.MapRoute(
                       name: "default",
                       template: "{controller=Home}/{action=Index}/{id?}");
                  });
            app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllers();
         });
      }
   }
}

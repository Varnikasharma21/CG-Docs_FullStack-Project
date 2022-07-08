using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using FinalCGDOCS.Models;
using FinalCGDOCS.RequestModels;

namespace FinalCGDOCS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        public static int userid;
        public static string username;
        private IConfiguration _config;
        private readonly DriveContext _cgcontext;

        public LoginController(IConfiguration config, DriveContext cg)
        {
            _config = config;
            _cgcontext = cg;
        }
        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreateToken([FromBody]LoginModel login)
        {
            IActionResult response = Unauthorized();
            var user = Authenticate(login);

            if (user != null)
            {
                var tokenString = BuildToken(user);
                response = Ok(new { token = tokenString, id = userid, name = username });

            }
            return response;

        }
        private string BuildToken(UsersRequest user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              expires: DateTime.Now.AddMinutes(30),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private UsersRequest Authenticate(LoginModel login)
        {
            UsersRequest user = null;
            var result = _cgcontext.Users.FirstOrDefault(obj => obj.Username == login.username);
            // var res= _cgcontext.Users.FirstOrDefault(obj => obj.Password == login.password);

            try
            {
                if (result.Username != null && result.UserPassword == login.password)
                {
                    user = new UsersRequest { Username = result.Username, UserPassword = result.UserPassword };
                    userid = result.UserId;
                    username = result.Username;
                }
            }
            catch (Exception e)
            {
                return null;
            }

            return user;
        }
        public class LoginModel
        {
            public string username { get; set; }
            public string password { get; set; }
        }
    }
}

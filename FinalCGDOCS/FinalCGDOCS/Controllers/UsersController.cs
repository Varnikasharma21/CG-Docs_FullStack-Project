using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinalCGDOCS.Models;
using FinalCGDOCS.RequestModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinalCGDOCS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DriveContext _cgcontext;



        public UserController(DriveContext project)
        {
            _cgcontext = project;
        }


        // GET All Users
        [HttpGet]

        public IEnumerable<Users> Get()
        {
            var getInfo = _cgcontext.Users.ToList();
            return getInfo;
        }
        //ADD a User
        [HttpPost]
        public void Post([FromBody] UsersRequest value)
        {
            Users obj = new Users();
            obj.Username = value.Username;
            obj.UserPassword = value.UserPassword;
            obj.UserCreatedAt = value.UserCreatedAt;
  
            _cgcontext.Users.Add(obj);
            _cgcontext.SaveChanges();


        }
    }
}

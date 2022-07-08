using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinalCGDOCS.RequestModels
{
    public class UsersRequest
    {
        public string Username { get; set; }
        public string UserPassword { get; set; }
        public DateTime? UserCreatedAt { get; set; }
    }
}

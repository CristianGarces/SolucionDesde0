using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Identity.Services;
using System.Threading.Tasks;

namespace SolucionDesde0.API.Identity.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class AuthController : ControllerBase
    {
        private IEnumerable<User> _users = new List<User>();
        private IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [MapToApiVersion(1)]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var result = await _authService.Register(user.Email, user.Password);

            return Ok(result);
        }

        [MapToApiVersion(1)]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var result = await _authService.Login(user.Email, user.Password);

            if (result == null)
            {
                return Unauthorized();
            }

            return Ok(result);
        }
    }

    public class User()
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

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
        private IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [MapToApiVersion(1)]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var result = await _authService.Register(user.Email, user.Password);

            _logger.LogInformation("User registered: {env}", Environment.GetEnvironmentVariable("Version"));

            return Ok(result);
        }

        [MapToApiVersion(1)]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var result = await _authService.Login(user.Email, user.Password);

            if (result == null)
            {
                _logger.LogWarning("Failed login attempt: {Email}", user.Email);
                return Unauthorized();
            }

            _logger.LogInformation("User logged in: {Email}", user.Email);

            return Ok(result);
        }
    }

    public class User()
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

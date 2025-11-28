using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Identity.Dto.Auth;
using SolucionDesde0.API.Identity.Dto.Users;
using SolucionDesde0.API.Identity.Services;
using System.Threading.Tasks;

namespace SolucionDesde0.API.Identity.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [MapToApiVersion(1)]
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequest user,
            [FromServices] IValidator<RegisterRequest> validator)
        {
            var validationResult = await validator.ValidateAsync(user);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var result = await _authService.Register(user.Name, user.Email, user.Password);

            if(result == null)
            {
                _logger.LogWarning("Failed registration attempt: {Email}", user.Email);
                return BadRequest("Registration failed.");
            }
            
            _logger.LogInformation("User registered: {Email}", user.Email);
            return Ok(result);
        }

        [MapToApiVersion(1)]
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequest user,
            [FromServices] IValidator<LoginRequest> validator)
        {
            var validationResult = await validator.ValidateAsync(user);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

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
}

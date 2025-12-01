using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Identity.Dto.Users;
using SolucionDesde0.API.Identity.Services.User;

namespace SolucionDesde0.API.Gateway.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v{v:apiVersion}/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/v1/users/{userId}
        [MapToApiVersion(1)]
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponse>> GetUser(string userId)
        {
            var user = await _userService.GetUser(userId);

            if (user == null)
            {
                return NotFound(new { Message = $"Usuario con ID {userId} no encontrado" });
            }

            return Ok(user);
        }

        // PUT: api/v1/users/{userId}
        [MapToApiVersion(1)]
        [HttpPut("{userId}")]
        public async Task<ActionResult<CrudUserResponse>> UpdateUser(
            string userId,
            [FromBody] UpdateUserRequest request,
            [FromServices] IValidator<UpdateUserRequest> validator)
        {
            var validation = await validator.ValidateAsync(request);

            if (!validation.IsValid)
            {
                return BadRequest(new CrudUserResponse
                {
                    Success = false,
                    Errors = validation.Errors.Select(e => e.ErrorMessage)
                });
            }

            var result = await _userService.UpdateUser(userId, request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // DELETE: api/v1/users/{userId}
        [MapToApiVersion(1)]
        [HttpDelete("{userId}")]
        public async Task<ActionResult<CrudUserResponse>> DeleteUser(string userId)
        {
            var result = await _userService.DeleteUser(userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
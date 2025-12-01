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

        // Crear usuario
        [MapToApiVersion(1)]
        [HttpPost("create")]
        public async Task<ActionResult> CreateUser(
            [FromBody] CreateUserRequest request,
            [FromServices] IValidator<CreateUserRequest> validator)
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

            var result = await _userService.CreateUser(request.Name, request.Email, request.Password);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // Patch para actualizar solo un campo, Put modifica todo el objeto
        [MapToApiVersion(1)]
        [HttpPatch("{userId}/change-pass")]
        public async Task<ActionResult<PasswordChangeResponse>> ChangePassword(
            string userId, 
            [FromBody] PasswordChangeRequest request,
            [FromServices] IValidator<PasswordChangeRequest> validator)
        {
            var validation = await validator.ValidateAsync(request);

            if (!validation.IsValid)
            {
                return BadRequest(validation.Errors);
            }

            var result = await _userService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);

            var response = new PasswordChangeResponse()
            {
                Success = result
            };

            if (!result)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}

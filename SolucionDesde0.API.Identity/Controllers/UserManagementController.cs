using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Identity.Dto.Users;
using SolucionDesde0.API.Identity.Services;

namespace SolucionDesde0.API.Gateway.Controllers
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v{v:apiVersion}/[controller]")]
    [Authorize]
    [Authorize(Roles = "Admin")]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;

        public UserManagementController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        // GET: Obtener todos los usuarios
        [MapToApiVersion(1)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
        {
            var users = await _userManagementService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: Obtener usuario por ID
        [MapToApiVersion(1)]
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponse>> GetUserById(string userId)
        {
            var user = await _userManagementService.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: Crear nuevo usuario
        [MapToApiVersion(1)]
        [HttpPost]
        public async Task<ActionResult<CrudUserResponse>> CreateUser(
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

            var result = await _userManagementService.CreateUserAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // PUT: Actualizar usuario completo
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

            var result = await _userManagementService.UpdateUserAsync(userId, request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // DELETE: Eliminar usuario
        [MapToApiVersion(1)]
        [HttpDelete("{userId}")]
        public async Task<ActionResult<CrudUserResponse>> DeleteUser(string userId)
        {
            var result = await _userManagementService.DeleteUserAsync(userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
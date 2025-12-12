using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Identity.Dto.Roles;
using SolucionDesde0.API.Identity.Services;
using SolucionDesde0.API.Identity.Services.Roles;
using System.Threading.Tasks;

namespace SolucionDesde0.API.Identity.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _rolesService;
        private readonly ILogger<RolesController> _logger;

        public RolesController(
            IRoleService rolesService,
            ILogger<RolesController> logger)
        {
            _rolesService = rolesService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<RoleResponse>>> GetAllRoles()
        {
            _logger.LogInformation("Solicitud para obtener todos los roles");
            var roles = await _rolesService.GetAllRolesAsync();
            return Ok(roles);
        }
    }
}
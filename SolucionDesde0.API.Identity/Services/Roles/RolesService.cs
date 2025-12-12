using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SolucionDesde0.API.Identity.Dto.Roles;

namespace SolucionDesde0.API.Identity.Services.Roles
{
    public class RolesService : IRoleService
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<RolesService> _logger;

        public RolesService(
            RoleManager<IdentityRole> roleManager,
            ILogger<RolesService> logger)
        {
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task<IEnumerable<RoleResponse>> GetAllRolesAsync()
        {
            _logger.LogInformation("Obteniendo todos los roles");

            var roles = await _roleManager.Roles
                .OrderBy(r => r.Name)
                .ToListAsync();

            var roleResponses = roles.Select(role => new RoleResponse
            {
                Id = role.Id,
                Name = role.Name
            });

            _logger.LogInformation("Se obtuvieron {Count} roles", roles.Count);
            return roleResponses;
        }
    }
}

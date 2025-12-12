using SolucionDesde0.API.Identity.Dto.Roles;

namespace SolucionDesde0.API.Identity.Services.Roles
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleResponse>> GetAllRolesAsync();
    }
}
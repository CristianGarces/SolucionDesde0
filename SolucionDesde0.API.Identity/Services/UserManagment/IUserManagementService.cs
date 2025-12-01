using SolucionDesde0.API.Identity.Dto.Users;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SolucionDesde0.API.Identity.Services
{
    public interface IUserManagementService
    {
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();
        Task<UserResponse?> GetUserByIdAsync(string userId);
        Task<CrudUserResponse> CreateUserAsync(CreateUserRequest request);
        Task<CrudUserResponse> UpdateUserAsync(string userId, UpdateUserRequest request);
        Task<CrudUserResponse> DeleteUserAsync(string userId);
    }
}
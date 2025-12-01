using SolucionDesde0.API.Identity.Dto.Users;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SolucionDesde0.API.Identity.Services
{
    public interface IUserManagementService
    {
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();
        Task<UserResponse?> GetUserByIdAsync(string userId);
        Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request);
        Task<UpdateUserResponse> UpdateUserAsync(string userId, UpdateUserRequest request);
        Task<DeleteUserResponse> DeleteUserAsync(string userId);
    }
}
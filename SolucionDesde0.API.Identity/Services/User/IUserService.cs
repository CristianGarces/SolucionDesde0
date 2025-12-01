using SolucionDesde0.API.Identity.Dto.Users;

namespace SolucionDesde0.API.Identity.Services.User
{
    public interface IUserService
    {
        public Task<CrudUserResponse> UpdateUser(string userId, UpdateUserRequest request);
        public Task<UserResponse> GetUser(string userId);
        public Task<CrudUserResponse> DeleteUser(string userId);

    }
}

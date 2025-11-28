using SolucionDesde0.API.Identity.Dto.Users;

namespace SolucionDesde0.API.Identity.Services.User
{
    public interface IUserService
    {
        Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
        Task<CreateUserResponse> CreateUser(string name, string email, string password);
    }
}

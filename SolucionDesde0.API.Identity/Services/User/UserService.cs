using Microsoft.AspNetCore.Identity;
using SolucionDesde0.API.Identity.Dto.Users;

namespace SolucionDesde0.API.Identity.Services.User
{
    public class UserService : IUserService
    {
        private UserManager<IdentityUser> _userManager;
        private ILogger<UserService> _logger;

        public UserService(UserManager<IdentityUser> userManager, ILogger<UserService> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<CreateUserResponse> CreateUser(string name, string email, string password)
        {
            var user = new IdentityUser
            {
                UserName = name,
                Email = email
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                _logger.LogError("Error creating user {UserName}: {Errors}", name, string.Join(", ", result.Errors.Select(e => e.Description)));
                return new CreateUserResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserName} created successfully", name);
            return new CreateUserResponse
            {
                Success = true
            };
        }

        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogInformation("User with ID {UserId} not found", userId);
                return false;
            }

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (!result.Succeeded)
            {
                _logger.LogError("Error changing password for user with ID {UserId}: {Errors}", userId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return false;
            }

            _logger.LogInformation("Password changed successfully for user with ID {UserId}", userId);
            return true;
        }
    }
}

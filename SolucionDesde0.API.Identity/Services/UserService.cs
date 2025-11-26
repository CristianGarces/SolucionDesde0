using Microsoft.AspNetCore.Identity;

namespace SolucionDesde0.API.Identity.Services
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

        // Change Password
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

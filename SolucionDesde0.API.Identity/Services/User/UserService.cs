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
        public async Task<UserResponse> GetUser(string userId)
        {
            _logger.LogInformation("Getting user by ID: {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found", userId);
                return null;
            }

            _logger.LogInformation("User with ID {UserId} found: {UserName}",
                userId, user.UserName);

            return new UserResponse
            {
                Id = user.Id,
                Name = user.UserName!,
                Email = user.Email!,
            };
        }
        public async Task<CrudUserResponse> UpdateUser(string userId, UpdateUserRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found for update", userId);
                return new CrudUserResponse
                {
                    Success = false,
                    Errors = new List<string> { "User not found" }
                };
            }

            user.UserName = request.Name;
            user.Email = request.Email;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                _logger.LogError("Error updating user {UserId}: {Errors}",
                    userId, string.Join(", ", updateResult.Errors.Select(e => e.Description)));

                return new CrudUserResponse
                {
                    Success = false,
                    Errors = updateResult.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserId} updated successfully", userId);
            return new CrudUserResponse
            {
                Success = true
            };
        }

        public async Task<CrudUserResponse> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found for deletion", userId);
                return new CrudUserResponse
                {
                    Success = false,
                    Errors = new List<string> { "User not found" }
                };
            }

            var deleteResult = await _userManager.DeleteAsync(user);

            if (!deleteResult.Succeeded)
            {
                _logger.LogError("Error deleting user {UserId}: {Errors}",
                    userId, string.Join(", ", deleteResult.Errors.Select(e => e.Description)));

                return new CrudUserResponse
                {
                    Success = false,
                    Errors = deleteResult.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserId} deleted successfully", userId);
            return new CrudUserResponse
            {
                Success = true
            };
        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SolucionDesde0.API.Identity.Dto.Users;
using Microsoft.Extensions.Logging;

namespace SolucionDesde0.API.Identity.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<UserManagementService> _logger;

        public UserManagementService(
            UserManager<IdentityUser> userManager,
            ILogger<UserManagementService> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            _logger.LogInformation("Getting all users");

            var users = await _userManager.Users.ToListAsync();

            _logger.LogInformation("Retrieved {UserCount} users", users.Count);
            return users.Select(user => new UserResponse
            {
                Id = user.Id,
                Name = user.UserName,
                Email = user.Email,
            });
        }

        public async Task<UserResponse?> GetUserByIdAsync(string userId)
        {
            _logger.LogInformation("Getting user by ID: {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found", userId);
                return null;
            }

            _logger.LogInformation("User with ID {UserId} found: {UserName}", userId, user.UserName);
            return new UserResponse
            {
                Id = user.Id,
                Name = user.UserName!,
                Email = user.Email!,
            };
        }

        public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request)
        {
            _logger.LogInformation("Creating new user: {UserName} ({Email})", request.Name, request.Email);

            var user = new IdentityUser
            {
                UserName = request.Name, 
                Email = request.Email,
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                _logger.LogError("Error creating user {UserName}: {Errors}",
                    request.Name, string.Join(", ", result.Errors.Select(e => e.Description)));

                return new CreateUserResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserName} created successfully with ID: {UserId}",
                request.Name, user.Id);

            return new CreateUserResponse
            {
                Success = true
            };
        }

        public async Task<UpdateUserResponse> UpdateUserAsync(string userId, UpdateUserRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found for update", userId);
                return new UpdateUserResponse
                {
                    Success = false,
                    Errors = new List<string> { "User not found" }
                };
            }

            user.UserName = request.Name;
            user.Email = request.Email;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                _logger.LogError("Error updating user {UserId}: {Errors}",
                    userId, string.Join(", ", result.Errors.Select(e => e.Description)));

                return new UpdateUserResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserId} updated successfully", userId);
            return new UpdateUserResponse
            {
                Success = true
            };
        }

        public async Task<DeleteUserResponse> DeleteUserAsync(string userId)
        {
            _logger.LogInformation("Deleting user with ID: {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found for deletion", userId);
                return new DeleteUserResponse
                {
                    Success = false,
                    Errors = new List<string> { "User not found" }
                };
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                _logger.LogError("Error deleting user {UserId}: {Errors}",
                    userId, string.Join(", ", result.Errors.Select(e => e.Description)));

                return new DeleteUserResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserName} ({UserId}) deleted successfully",
                user.UserName, userId);

            return new DeleteUserResponse
            {
                Success = true
            };
        }
    }
}
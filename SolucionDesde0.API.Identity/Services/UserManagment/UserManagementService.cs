using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SolucionDesde0.API.Identity.Dto.Users;

namespace SolucionDesde0.API.Identity.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<UserManagementService> _logger;

        public UserManagementService(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<UserManagementService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
        {
            _logger.LogInformation("Getting all users with roles");

            var users = await _userManager.Users.ToListAsync();
            var userResponses = new List<UserResponse>();

            foreach (var user in users)
            {
                var roleId = await GetUserRoleIdAsync(user);

                userResponses.Add(new UserResponse
                {
                    Id = user.Id,
                    Name = user.UserName!,
                    Email = user.Email!,
                    RoleId = roleId ?? string.Empty
                });
            }

            _logger.LogInformation("Retrieved {UserCount} users with roles", userResponses.Count);
            return userResponses;
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

            var roleId = await GetUserRoleIdAsync(user);

            _logger.LogInformation("User with ID {UserId} found: {UserName} - Role: {Role}",
                userId, user.UserName, roleId);

            return new UserResponse
            {
                Id = user.Id,
                Name = user.UserName!,
                Email = user.Email!,
                RoleId = roleId ?? string.Empty
            };
        }

        public async Task<CrudUserResponse> CreateUserAsync(CreateUserRequest request)
        {
            _logger.LogInformation("Creating new user: {UserName} ({Email}) - RoleId: {RoleId}", request.Name, request.Email, request.RoleId);

            var role = await _roleManager.FindByIdAsync(request.RoleId);
            if (role == null)
            {
                _logger.LogError("Role with ID {RoleId} not found", request.RoleId);
                return new CrudUserResponse
                {
                    Success = false,
                    Errors = new List<string> { $"Role with ID {request.RoleId} not found" }
                };
            }

            var user = new IdentityUser
            {
                UserName = request.Name,
                Email = request.Email,
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);

            if (!createResult.Succeeded)
            {
                _logger.LogError("Error creating user {UserName}: {Errors}",
                    request.Name, string.Join(", ", createResult.Errors.Select(e => e.Description)));

                return new CrudUserResponse
                {
                    Success = false,
                    Errors = createResult.Errors.Select(e => e.Description)
                };
            }

            var roleName = await GetRoleNameByIdAsync(request.RoleId);

            if (string.IsNullOrEmpty(roleName))
            {
                _logger.LogWarning("Could not get role name for ID: {RoleId}", request.RoleId);
                return new CrudUserResponse
                {
                    Success = false,
                    Errors = new List<string> { $"Could not get role name for ID: {request.RoleId}" }
                };
            }

            var addToRoleResult = await _userManager.AddToRoleAsync(user, roleName);

            if (!addToRoleResult.Succeeded)
            {
                _logger.LogError("Error assigning role {RoleId} to user {UserName}: {Errors}",
                    role.Id, request.Name, string.Join(", ", addToRoleResult.Errors.Select(e => e.Description)));

                await _userManager.DeleteAsync(user);

                return new CrudUserResponse
                {
                    Success = false,
                    Errors = addToRoleResult.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserName} created successfully with ID: {UserId}",
                request.Name, user.Id);

            return new CrudUserResponse
            {
                Success = true
            };
        }

        public async Task<CrudUserResponse> UpdateUserAsync(string userId, UpdateUserRequest request)
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

            if (!string.IsNullOrEmpty(request.RoleId))
            {
                var role = await _roleManager.FindByIdAsync(request.RoleId);
                if (role == null)
                {
                    _logger.LogWarning("Role with ID {RoleId} not found during user update", request.RoleId);
                    return new CrudUserResponse
                    {
                        Success = false,
                        Errors = new List<string> { $"Role with ID {request.RoleId} not found" }
                    };
                }

                var currentRoles = await _userManager.GetRolesAsync(user);

                if (currentRoles.Any())
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                }

                var roleName = await GetRoleNameByIdAsync(request.RoleId);

                if (string.IsNullOrEmpty(roleName))
                {
                    _logger.LogWarning("Could not get role name for ID: {RoleId}", request.RoleId);
                    return new CrudUserResponse
                    {
                        Success = false,
                        Errors = new List<string> { $"Could not get role name for ID: {request.RoleId}" }
                    };
                }

                var addToRoleResult = await _userManager.AddToRoleAsync(user, roleName);

                if (!addToRoleResult.Succeeded)
                {
                    _logger.LogError("Error updating role for user {UserId}: {Errors}",
                        userId, string.Join(", ", addToRoleResult.Errors.Select(e => e.Description)));

                    return new CrudUserResponse
                    {
                        Success = false,
                        Errors = addToRoleResult.Errors.Select(e => e.Description)
                    };
                }

                _logger.LogInformation("User {UserId} role updated to: {RoleName}", userId, roleName);
            }

            _logger.LogInformation("User {UserId} updated successfully", userId);
            return new CrudUserResponse
            {
                Success = true
            };
        }

        public async Task<CrudUserResponse> DeleteUserAsync(string userId)
        {
            _logger.LogInformation("Deleting user with ID: {UserId}", userId);

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

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                _logger.LogError("Error deleting user {UserId}: {Errors}",
                    userId, string.Join(", ", result.Errors.Select(e => e.Description)));

                return new CrudUserResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            _logger.LogInformation("User {UserName} ({UserId}) deleted successfully",
                user.UserName, userId);

            return new CrudUserResponse
            {
                Success = true
            };
        }

        // HELPERS
        private async Task<string> GetUserRoleAsync(IdentityUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return roles.FirstOrDefault() ?? "Sin rol";
        }

        private async Task<string?> GetUserRoleIdAsync(IdentityUser user)
        {
            var roleName = await GetUserRoleAsync(user);
            if (roleName == "Sin rol") return null;

            var role = await _roleManager.FindByNameAsync(roleName);
            return role?.Id;
        }

        public async Task<string?> GetRoleNameByIdAsync(string roleId)
        {
            if (string.IsNullOrEmpty(roleId))
                return null;

            var role = await _roleManager.FindByIdAsync(roleId);
            return role?.Name;
        }

    }
}
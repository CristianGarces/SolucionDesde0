using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using SolucionDesde0.API.Identity.Dto.Users;
using SolucionDesde0.API.Identity.Services;

namespace SolucionDesde0.Api.Identity.Test
{
    [TestFixture]
    public class UserManagementServiceTest
    {
        private Mock<UserManager<IdentityUser>> _mockUserManager;
        private Mock<RoleManager<IdentityRole>> _mockRoleManager;
        private Mock<ILogger<UserManagementService>> _mockLogger;
        private UserManagementService _userManagementService;

        [SetUp]
        public void Setup()
        {
            // Mock UserStore
            var userStore = new Mock<IUserStore<IdentityUser>>();
            _mockUserManager = new Mock<UserManager<IdentityUser>>(
                userStore.Object,
                null, null, null, null, null, null, null, null
            );

            // Mock RoleStore
            var roleStore = new Mock<IRoleStore<IdentityRole>>();
            _mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                roleStore.Object,
                null, null, null, null
            );

            // Mock Logger
            _mockLogger = new Mock<ILogger<UserManagementService>>();

            // Create service
            _userManagementService = new UserManagementService(
                _mockUserManager.Object,
                _mockRoleManager.Object,
                _mockLogger.Object
            );
        }

        #region GetUserByIdAsync Tests

        [Test]
        public async Task GetUserByIdAsync_WithValidId_ShouldReturnUserSuccessfully()
        {
            // Arrange
            var userId = "user-123";
            var user = new IdentityUser
            {
                Id = userId,
                UserName = "testuser",
                Email = "test@example.com"
            };

            _mockUserManager.Setup(um => um.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(um => um.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "Admin" });

            _mockRoleManager.Setup(rm => rm.FindByNameAsync("Admin"))
                .ReturnsAsync(new IdentityRole { Id = "role-admin", Name = "Admin" });

            // Act
            var result = await _userManagementService.GetUserByIdAsync(userId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Id, Is.EqualTo(userId));
            Assert.That(result.Name, Is.EqualTo("testuser"));
            Assert.That(result.Email, Is.EqualTo("test@example.com"));
            Assert.That(result.RoleId, Is.EqualTo("role-admin"));
        }

        #endregion

        #region CreateUserAsync Tests

        [Test]
        public async Task CreateUserAsync_WithValidData_ShouldCreateUserSuccessfully()
        {
            // Arrange
            var createRequest = new CreateUserRequest
            {
                Name = "newuser",
                Email = "newuser@example.com",
                Password = "ValidPassword123!",
                RoleId = "role-admin"
            };

            var role = new IdentityRole { Id = "role-admin", Name = "Admin" };

            _mockRoleManager.Setup(rm => rm.FindByIdAsync("role-admin"))
                .ReturnsAsync(role);

            _mockUserManager.Setup(um => um.CreateAsync(It.IsAny<IdentityUser>(), "ValidPassword123!"))
                .ReturnsAsync(IdentityResult.Success)
                .Callback<IdentityUser, string>((user, _) => user.Id = "new-user-id");

            _mockUserManager.Setup(um => um.AddToRoleAsync(It.Is<IdentityUser>(u => u.Id == "new-user-id"), "Admin"))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _userManagementService.CreateUserAsync(createRequest);

            // Assert
            Assert.That(result.Success, Is.True);
            Assert.That(result.Errors == null || !result.Errors.Any(), Is.True);

            _mockUserManager.Verify(x => x.CreateAsync(It.Is<IdentityUser>(
                u => u.UserName == "newuser" && u.Email == "newuser@example.com"),
                "ValidPassword123!"), Times.Once);
        }

        #endregion

        #region UpdateUserAsync Tests

        [Test]
        public async Task UpdateUserAsync_WithValidData_ShouldUpdateUserSuccessfully()
        {
            // Arrange
            var userId = "user-123";
            var user = new IdentityUser
            {
                Id = userId,
                UserName = "oldname",
                Email = "old@example.com"
            };

            var updateRequest = new UpdateUserRequest
            {
                Name = "newname",
                Email = "new@example.com",
                RoleId = "role-admin"
            };

            var role = new IdentityRole { Id = "role-admin", Name = "Admin" };

            _mockUserManager.Setup(um => um.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(um => um.UpdateAsync(It.Is<IdentityUser>(u =>
                u.UserName == "newname" && u.Email == "new@example.com")))
                .ReturnsAsync(IdentityResult.Success);

            _mockRoleManager.Setup(rm => rm.FindByIdAsync("role-admin"))
                .ReturnsAsync(role);

            _mockUserManager.Setup(um => um.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "OldRole" });

            _mockUserManager.Setup(um => um.RemoveFromRolesAsync(user, It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(IdentityResult.Success);

            _mockUserManager.Setup(um => um.AddToRoleAsync(user, "Admin"))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _userManagementService.UpdateUserAsync(userId, updateRequest);

            // Assert
            Assert.That(result.Success, Is.True);
            Assert.That(result.Errors == null || !result.Errors.Any(), Is.True);

            _mockUserManager.Verify(x => x.UpdateAsync(It.IsAny<IdentityUser>()), Times.Once);
            _mockUserManager.Verify(x => x.AddToRoleAsync(user, "Admin"), Times.Once);
        }

        #endregion

        #region DeleteUserAsync Tests

        [Test]
        public async Task DeleteUserAsync_WithValidId_ShouldDeleteUserSuccessfully()
        {
            // Arrange
            var userId = "user-123";
            var user = new IdentityUser
            {
                Id = userId,
                UserName = "testuser",
                Email = "test@example.com"
            };

            _mockUserManager.Setup(um => um.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(um => um.DeleteAsync(user))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _userManagementService.DeleteUserAsync(userId);

            // Assert
            Assert.That(result.Success, Is.True);
            Assert.That(result.Errors == null || !result.Errors.Any(), Is.True);

            _mockUserManager.Verify(x => x.FindByIdAsync(userId), Times.Once);
            _mockUserManager.Verify(x => x.DeleteAsync(user), Times.Once);
        }

        #endregion
    }
}
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;
using SolucionDesde0.API.Identity.Dto.Users;
using SolucionDesde0.API.Identity.Services.User;

namespace SolucionDesde0.Api.Identity.Test
{
    [TestFixture]
    public class UserServiceTest
    {
        private Mock<UserManager<IdentityUser>> _mockUserManager;
        private Mock<ILogger<UserService>> _mockLogger;
        private UserService _userService;

        [SetUp]
        public void Setup()
        {
            // Mock UserStore
            var store = new Mock<IUserStore<IdentityUser>>();

            // Mock UserManager
            _mockUserManager = new Mock<UserManager<IdentityUser>>(
                store.Object,
                null, null, null, null, null, null, null, null
            );

            // Mock Logger
            _mockLogger = new Mock<ILogger<UserService>>();

            // Create UserService with mocked dependencies
            _userService = new UserService(
                _mockUserManager.Object,
                _mockLogger.Object
            );
        }

        #region Happy Path Tests

        [Test]
        public async Task GetUser_WithValidId_ShouldReturnUserSuccessfully()
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

            // Act
            var result = await _userService.GetUser(userId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Id, Is.EqualTo(userId));
            Assert.That(result.Name, Is.EqualTo("testuser"));
            Assert.That(result.Email, Is.EqualTo("test@example.com"));

            _mockUserManager.Verify(x => x.FindByIdAsync(userId), Times.Once);
        }

        [Test]
        public async Task UpdateUser_WithValidData_ShouldUpdateSuccessfully()
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
                RoleId = "role-456"
            };

            _mockUserManager.Setup(um => um.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(um => um.UpdateAsync(It.Is<IdentityUser>(u =>
                u.Id == userId &&
                u.UserName == "newname" &&
                u.Email == "new@example.com")))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _userService.UpdateUser(userId, updateRequest);

            // Assert
            Assert.That(result.Success, Is.True);
            Assert.That(result.Errors == null || !result.Errors.Any(), Is.True);

            _mockUserManager.Verify(x => x.FindByIdAsync(userId), Times.Once);
            _mockUserManager.Verify(x => x.UpdateAsync(It.IsAny<IdentityUser>()), Times.Once);
        }

        [Test]
        public async Task DeleteUser_WithValidId_ShouldDeleteSuccessfully()
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
            var result = await _userService.DeleteUser(userId);

            // Assert
            Assert.That(result.Success, Is.True);
            Assert.That(result.Errors == null || !result.Errors.Any(), Is.True);

            _mockUserManager.Verify(x => x.FindByIdAsync(userId), Times.Once);
            _mockUserManager.Verify(x => x.DeleteAsync(user), Times.Once);
        }

        #endregion
    }
}
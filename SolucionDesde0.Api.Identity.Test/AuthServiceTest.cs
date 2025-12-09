using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using SolucionDesde0.API.Identity.Data;
using SolucionDesde0.API.Identity.Services.Auth;
using SolucionDesde0.Shared.Events;


namespace SolucionDesde0.Api.Identity.Test
{
    [TestFixture]
    public class AuthServiceTest
    {
        private Mock<UserManager<IdentityUser>> _mockUserManager;
        private Mock<IConfiguration> _mockConfiguration;
        private Mock<IPublishEndpoint> _mockPublishEndpoint;
        private AuthService _authService;

        [SetUp]
        public void Setup()
        {
            var store = new Mock<IUserStore<IdentityUser>>();
            _mockUserManager = new Mock<UserManager<IdentityUser>>(
                store.Object,
                null, null, null, null, null, null, null, null
            );

            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.Setup(c => c["JWT:SecretKey"]).Returns("ThisIsMySuperSecretKey!1234554321");
            _mockConfiguration.Setup(c => c["JWT:Audience"]).Returns("TestAudience");
            _mockConfiguration.Setup(c => c["JWT:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(c => c["JWT:ExpiryInMinutes"]).Returns("60");

            _mockPublishEndpoint = new Mock<IPublishEndpoint>();

            _authService = new AuthService(
                _mockUserManager.Object,
                _mockConfiguration.Object,
                _mockPublishEndpoint.Object
            );

        }

        #region Register Tests

        [Test]
        public async Task Register_WithValidCredentials_ShouldReturnTrue()
        {
            // Arrange
            var name = "testuser";
            var email = "test@example.com";
            var password = "ValidPassword123!";
            var user = new IdentityUser { Id = "test-user-id", Email = email, UserName = email };

            _mockUserManager.Setup(um => um.CreateAsync(It.IsAny<IdentityUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            _mockUserManager.Setup(um => um.AddToRoleAsync(It.IsAny<IdentityUser>(), Roles.Member))
                .ReturnsAsync(IdentityResult.Success);

            _mockPublishEndpoint.Setup(pe => pe.Publish(It.IsAny<UserCreatedEvents>(), default))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _authService.Register(name, email, password);

            // Assert
            Assert.That(result.Succeeded, Is.True);

            _mockUserManager.Verify(x => x.CreateAsync(It.Is<IdentityUser>(u =>
                u.Email == email && u.UserName == name), password), Times.Once);

            _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<IdentityUser>(), Roles.Member), Times.Once);

            _mockPublishEndpoint.Verify(x => x.Publish(It.Is<UserCreatedEvents>(e =>
                e.Email == email), default), Times.Once);
        }

        #endregion

        #region Login Tests

        [Test]
        public async Task Login_WithWrongPassword_ShouldReturnNull()
        {
            // Arrange
            var email = "test@example.com";
            var wrongPassword = "WrongPassword456!";
            var user = new IdentityUser
            {
                Id = "user-123",
                Email = email,
                UserName = "testuser"
            };

            _mockUserManager.Setup(um => um.FindByEmailAsync(email))
                .ReturnsAsync(user);

            _mockUserManager.Setup(um => um.CheckPasswordAsync(user, wrongPassword))
                .ReturnsAsync(false); 

            // Act
            var result = await _authService.Login(email, wrongPassword);

            // Assert
            Assert.That(result, Is.Null);
            _mockUserManager.Verify(x => x.GetRolesAsync(It.IsAny<IdentityUser>()), Times.Never);
        }

        [Test]
        public async Task Login_WithNonExistentEmail_ShouldReturnNull()
        {
            // Arrange
            var nonExistentEmail = "nonexistent@example.com";
            var password = "SomePassword123!";

            _mockUserManager.Setup(um => um.FindByEmailAsync(nonExistentEmail))
                .ReturnsAsync((IdentityUser)null!); 

            // Act
            var result = await _authService.Login(nonExistentEmail, password);

            // Assert
            Assert.That(result, Is.Null);
            _mockUserManager.Verify(x => x.CheckPasswordAsync(It.IsAny<IdentityUser>(), It.IsAny<string>()), Times.Never);
        }

        [Test]
        public async Task Login_WithValidCredentials_ShouldReturnTrue()
        {
            // Arrange
            var email = "test@example.com";
            var password = "ValidPassword123!";
            var userId = "user-123";
            var userName = "testuser";

            var user = new IdentityUser
            {
                Id = userId,
                UserName = userName,
                Email = email,
                EmailConfirmed = true
            };

            _mockUserManager.Setup(um => um.FindByEmailAsync(email))
                .ReturnsAsync(user);

            _mockUserManager.Setup(um => um.CheckPasswordAsync(user, password))
                .ReturnsAsync(true);

            _mockUserManager.Setup(um => um.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "Member" });

            _mockConfiguration.Setup(c => c["JWT:ExpireMinutes"]).Returns("60");

            _mockConfiguration.Setup(c => c["JWT:Audience"]).Returns("TestAudience");
            _mockConfiguration.Setup(c => c["JWT:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(c => c["JWT:SecretKey"]).Returns("ThisIsMySuperSecretKey!1234554321");

            // Act
            var result = await _authService.Login(email, password);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Token, Is.Not.Null.And.Not.Empty);

            Assert.That(result.Token, Does.StartWith("eyJ"));

            var expectedExpiration = DateTime.UtcNow.AddMinutes(60);
            Assert.That(result.Expiration, Is.EqualTo(expectedExpiration).Within(1).Seconds);

            _mockUserManager.Verify(x => x.FindByEmailAsync(email), Times.Once);
            _mockUserManager.Verify(x => x.CheckPasswordAsync(user, password), Times.Once);
            _mockUserManager.Verify(x => x.GetRolesAsync(user), Times.Once);
        }

        #endregion
    }
}

using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SolucionDesde0.API.Identity.Dto.Auth;
using SolucionDesde0.Shared.Events;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SolucionDesde0.API.Identity.Services.Auth
{
    public class AuthService : IAuthService
    {
        private UserManager<IdentityUser> _userManeger;
        // Para el JWT (coge info de appsettings)
        private readonly IConfiguration _configuration;
        // Para las notificaciones
        private readonly IPublishEndpoint _publishEndpoint;

        public AuthService(UserManager<IdentityUser> userManeger, IConfiguration configuration, IPublishEndpoint publishEndpoint)
        {
            _userManeger = userManeger;
            _configuration = configuration;
            _publishEndpoint = publishEndpoint;
        }
        public async Task<RegisterResponse> Register(string name, string email, string password)
        {
            var user = new IdentityUser
            {
                UserName = name,
                Email = email
            };

            var result = await _userManeger.CreateAsync(user, password);

            var addToRoleResult = await _userManeger.AddToRoleAsync(user, Data.Roles.Member);
            if (!addToRoleResult.Succeeded)
            {
                await _userManeger.DeleteAsync(user);
                return new RegisterResponse
                {
                    Succeeded = false,
                    Errors = addToRoleResult.Errors.Select(e => e.Description)
                };
            }

            if (result.Succeeded && user != null)
            {
                await _publishEndpoint.Publish(new UserCreatedEvents(user.Id, user.Email!));

                return new RegisterResponse
                {
                    Succeeded = true,
                    Errors = Enumerable.Empty<string>()
                };
            }

            return new RegisterResponse
            {
                Succeeded = false,
                Errors = result.Errors.Select(e => e.Description)
            };
        }

        public async Task<Login> Login(string email, string password)
        {
            var user = await _userManeger.FindByEmailAsync(email);

            if (user == null)
            {
                return null;
            }

            var result = await _userManeger.CheckPasswordAsync(user, password);

            if (!result)
            {
                return null;
            }

            //Generate Jwt Token
            var audience = _configuration["JWT:Audience"];
            var issuer = _configuration["JWT:Issuer"];
            var expirationMinutes = int.Parse(_configuration["JWT:ExpireMinutes"]!);

            // Crear la clave de seguridad
            var secretKey = _configuration["JWT:SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims - contienen la informacion del usuario
            var roles = await _userManeger.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? "No role assigned")
            };

            // Create token
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials
            );

            var encryptedToken = new JwtSecurityTokenHandler().WriteToken(token);


            return new Login
            {
                Token = encryptedToken,
                Expiration = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };
        }

    }
}

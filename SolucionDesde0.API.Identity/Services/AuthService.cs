using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SolucionDesde0.API.Identity.Dto.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SolucionDesde0.API.Identity.Services
{
    public class AuthService : IAuthService
    {
        private UserManager<IdentityUser> _userManeger;
        private RoleManager<IdentityRole> _roleManager;
        // Para el JWT (coge info de appsettings)
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<IdentityUser> userManeger, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManeger = userManeger;
            _roleManager = roleManager;
            _configuration = configuration;
        }
        public async Task<bool> Register(string email, string password)
        {
            var result = await _userManeger.CreateAsync(new IdentityUser
            {
                UserName = email.Split("@")[0],
                Email = email
            }, password);

            return result.Succeeded;
        }

        public async Task<ResponseLogin> Login(string email, string password)
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


            return new ResponseLogin
            {
                Token = encryptedToken,
                Expiration = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };
        }

    }
}

using Microsoft.AspNetCore.Identity;
using SolucionDesde0.API.Identity.Dto.Auth;

namespace SolucionDesde0.API.Identity.Services
{
    public interface IAuthService
    {
        Task<RegisterResponse> Register(string name, string email, string password);
        Task<Login> Login(string email, string password);
    }
}

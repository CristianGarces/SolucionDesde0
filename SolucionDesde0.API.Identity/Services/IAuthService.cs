using Microsoft.AspNetCore.Identity;
using SolucionDesde0.API.Identity.Dto.Auth;

namespace SolucionDesde0.API.Identity.Services
{
    public interface IAuthService
    {
        Task<bool> Register(string email, string password);
        Task<ResponseLogin> Login(string email, string password);
    }
}

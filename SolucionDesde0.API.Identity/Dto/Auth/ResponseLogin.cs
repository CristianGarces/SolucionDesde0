namespace SolucionDesde0.API.Identity.Dto.Auth
{
    public class ResponseLogin
    {
        public required string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}

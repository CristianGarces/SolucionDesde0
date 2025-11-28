namespace SolucionDesde0.API.Identity.Dto.Auth
{
    public record Login
    {
        public required string Token { get; set; }
        public DateTime Expiration { get; set; }
    }

    public record LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

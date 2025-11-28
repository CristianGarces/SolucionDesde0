namespace SolucionDesde0.API.Identity.Dto.Users
{
    public record CreateUserRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public record CreateUserResponse
    {
        public bool Success { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}

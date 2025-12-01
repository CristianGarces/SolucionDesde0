namespace SolucionDesde0.API.Identity.Dto.Users
{
    public record CreateUserRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public record CrudUserResponse
    {
        public bool Success { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }

    public record UpdateUserRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public record UserResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
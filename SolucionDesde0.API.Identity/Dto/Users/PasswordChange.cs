namespace SolucionDesde0.API.Identity.Dto.Users
{
    public sealed class PasswordChangeResponse
    {
        public bool Success { get; set; }
    }

    public sealed class PasswordChangeRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}

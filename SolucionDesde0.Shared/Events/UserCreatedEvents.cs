namespace SolucionDesde0.Shared.Events
{
    public sealed record UserCreatedEvents(string UserId, string Email) : IEventBase
    {
        public Guid EventId => Guid.NewGuid();
        public DateTime CreatedAt => DateTime.UtcNow;
    }
}
using MassTransit;
using SolucionDesde0.Shared.Events;

internal class UserRegisteredConsumer : IConsumer<UserCreatedEvents>
{
    private readonly ILogger<UserRegisteredConsumer> _logger;

    public UserRegisteredConsumer(ILogger<UserRegisteredConsumer> logger)
    {
        _logger = logger;
    }
    public Task Consume(ConsumeContext<UserCreatedEvents> context)
    {
        var user = context.Message; 
        _logger.LogInformation("New user registered: {UserId}, Email: {Email}", user.UserId, user.Email);
        return Task.CompletedTask;
    }
}
using MassTransit;
using SolucionDesde0.Shared.Events;

internal class UserRegisteredConsumer : IConsumer<UserCreatedEvents>
{
    private readonly ILogger<UserRegisteredConsumer> _logger;
    private IEmailService _emailService;

    public UserRegisteredConsumer(ILogger<UserRegisteredConsumer> logger, IEmailService emailService)
    {
        _logger = logger;
        _emailService = emailService;
    }

    public Task Consume(ConsumeContext<UserCreatedEvents> context)
    {
        var user = context.Message; 
        _logger.LogInformation("New user registered: {UserId}, Email: {Email}", user.UserId, user.Email);
        _emailService.SendWelcomeEmail(user.Email);
        return Task.CompletedTask;
    }
}
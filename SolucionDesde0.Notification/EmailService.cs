
using MailKit.Net.Smtp;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;
    public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendWelcomeEmail (string toEmail)
    {
        using var client = new SmtpClient();

        var host = _configuration.GetSection("Email:SmtpHost").Value!;
        var port = int.Parse(_configuration.GetSection("Email:SmtpPort").Value!);

        client.Connect(host, port, false);

        var fromEmail = _configuration.GetSection("Email:FromAddress").Value;
        var message = new MimeKit.MimeMessage();
        message.From.Add(new MimeKit.MailboxAddress("NoReply - ", fromEmail!));    
        message.To.Add(new MimeKit.MailboxAddress("", toEmail));
        message.Subject = "Welcome to SolucionDesde0";
        message.Body = new MimeKit.TextPart("plain")
        {
            Text = "Thank you for joining SolucionDesde0!"
        };

        await client.SendAsync(message);
        _logger.LogInformation($"Welcome email sent to {toEmail}");
    }
}
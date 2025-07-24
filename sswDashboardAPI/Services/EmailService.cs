using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using sswDashboardAPI.Models;
using sswDashboardAPI.Services.Interfaces;

namespace sswDashboardAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(EmailMessages message)
        {
            var client = new SmtpClient(_config["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(_config["EmailSettings:Port"]),
                Credentials = new NetworkCredential(
                    _config["EmailSettings:Username"],
                    _config["EmailSettings:Password"]),
                EnableSsl = true
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_config["EmailSettings:SenderEmail"]),
                Subject = message.Subject,
                Body = message.Body,
                IsBodyHtml = true
            };

            mail.To.Add(message.To);
            await client.SendMailAsync(mail);
        }
    }

}

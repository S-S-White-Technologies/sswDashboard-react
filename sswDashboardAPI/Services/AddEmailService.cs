using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace sswDashboardAPI.Services
{
    public class AddEmailService
    {
        private readonly IConfiguration _configuration;

        public AddEmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var portString = _configuration["EmailSettings:Port"];
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var username = _configuration["EmailSettings:Username"];
            var password = _configuration["EmailSettings:Password"];

            if (!int.TryParse(portString, out var port))
                throw new ArgumentException("SMTP Port is not a valid integer in configuration.");

            using (var client = new SmtpClient(smtpServer, port))
            {
                client.Credentials = new NetworkCredential(username, password);
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "SS White Technologies"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                try
                {
                    await client.SendMailAsync(mailMessage);
                    return true;
                }
                catch (Exception ex)
                {
                    // Consider logging the exception here
                    return false;
                }
            }
        }

    }
}

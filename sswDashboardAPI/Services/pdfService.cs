using DinkToPdf;
using DinkToPdf.Contracts;
using Newtonsoft.Json;
using sswDashboardAPI.Model;

namespace sswDashboardAPI.Services
{
    

    public class PdfService
    {
        private readonly IConverter _converter;

        public PdfService(IConverter converter)
        {
            _converter = converter;
        }

        public byte[] GenerateReviewPdf(ExemptedReview review)
        {
            var html = BuildHtmlFromReview(review); // Convert your review JSON to HTML string

            var doc = new HtmlToPdfDocument
            {
                GlobalSettings = {
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4
            },
                Objects = {
                new ObjectSettings {
                    HtmlContent = html
                }
            }
            };

            return _converter.Convert(doc);
        }

        private string BuildHtmlFromReview(ExemptedReview review)
        {
            var summary = JsonConvert.DeserializeObject<SummaryDto>(review.Summary);
            return $@"
            <html>
            <body>
                <h1>Exempted Review - {review.EmpId}</h1>
                <p><strong>Strengths:</strong> {summary.Strengths}</p>
                <p><strong>Improvements:</strong> {summary.Improvements}</p>
                <!-- Add more sections as needed -->
                <p><strong>HR Signature:</strong> {summary.Signature?.Name} ({summary.Signature?.Font})</p>
            </body>
            </html>";
        }
    }

}

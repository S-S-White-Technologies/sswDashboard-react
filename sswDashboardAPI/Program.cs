using Microsoft.EntityFrameworkCore;
using sswDashboardAPI.Data;
using sswDashboardAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Intuit.Ipp.ReportService;
using sswDashboardAPI.Services.HRModules;
using sswDashboardAPI.Services.Interfaces;
using DinkToPdf.Contracts;
using DinkToPdf;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var wkhtmltopdfPath = Path.Combine(Directory.GetCurrentDirectory(), "libs", "libwkhtmltox.dll");

var context = new CustomAssemblyLoadContext();
context.LoadUnmanagedLibrary(wkhtmltopdfPath);

builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddTransient<AddEmailService>();
builder.Services.AddScoped<IExemptedReviewService, ExemptedReviewService>();
builder.Services.AddHttpClient<DepartmentService>();  // ✅ Add this
builder.Services.AddScoped<DepartmentService>();       // ✅ And this
builder.Services.AddScoped<RoleService>();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<EpicorERPContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EpicorERPConnection")));

builder.Services.AddScoped<PunchService>();
builder.Services.AddScoped<PdfService>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IConverter>(new SynchronizedConverter(new PdfTools()));
var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();


app.MapControllers();

app.Run();

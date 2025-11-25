using SolucionDesde0.API.Gateway.Extensions;
using SolucionDesde0.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();

builder.Services.AddYarpReverseProxy(builder.Configuration);

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Activar el Middleware
app.UseCors();
app.MapReverseProxy();

app.MapControllers();
app.MapDefaultEndpoints();

app.Run();

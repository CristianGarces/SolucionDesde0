using SolucionDesde0.API.Gateway.Extensions;

var builder = WebApplication.CreateBuilder(args);

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

app.Run();

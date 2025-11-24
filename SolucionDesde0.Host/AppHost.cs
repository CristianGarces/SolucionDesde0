using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// Project Identity
var identity = builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity");

// Postgres
var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHostPort(54614)
    .WithPgAdmin(pgAdmin => pgAdmin.WithHostPort(54615)); 
var postgresDb = postgres.AddDatabase("SolucionDesde0Db");  

// Reference Db in Identity
identity.WithReference(postgresDb).WaitFor(postgresDb);

builder.Build().Run();

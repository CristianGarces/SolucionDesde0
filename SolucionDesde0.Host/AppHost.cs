using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// Project Api Identity
var identity = builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity");

// Project Api Gateway
var gateway = builder.AddProject<Projects.SolucionDesde0_API_Gateway>("soluciondesde0-api-gateway");

// Postgres y PgAdmin
var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHostPort(54614)
    .WithPgAdmin(pgAdmin => pgAdmin.WithHostPort(54615)); 
var postgresDb = postgres.AddDatabase("SolucionDesde0Db");  

// Reference Db to Identity
identity.WithReference(postgresDb).WaitFor(postgresDb);

// Reference Identity to Gateway
gateway.WithReference(identity).WaitFor(identity);


builder.Build().Run();

var builder = DistributedApplication.CreateBuilder(args);

// Project Api Identity
var identity = builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity");
//var identity2 = builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity2");

// Project Api Gateway
var gateway = builder.AddProject<Projects.SolucionDesde0_API_Gateway>("soluciondesde0-api-gateway");

// Redis 
var redis = builder.AddRedis("redis")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithRedisInsight();

// RabbitMq
var rabbitMq = builder.AddRabbitMQ("rabbitmq")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithManagementPlugin();

// Postgres y PgAdmin
var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHostPort(54614)
    .WithPgAdmin(pgAdmin => pgAdmin.WithHostPort(54615));
var postgresDb = postgres.AddDatabase("SolucionDesde0Db");

// Reference Db to Identity and Enviroment
identity
    .WaitFor(postgresDb)
    .WaitFor(rabbitMq)
    .WithReference(postgresDb)
    .WithReference(rabbitMq);

//identity2
//    .WaitFor(postgresDb)
//    .WithEnvironment("Version", "2")
//    .WithReference(postgresDb);

// Reference Identity & Redis to Gateway
gateway
    .WaitFor(identity)
    .WithReference(identity)
    .WaitFor(redis)
    .WithReference(redis);
//gateway.WaitFor(identity2).WithReference(identity2);


builder.Build().Run();

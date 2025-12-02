var builder = DistributedApplication.CreateBuilder(args);

// Project Api Identity
var identity = builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity");

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

// Notifications Service
var notifications = builder.AddProject<Projects.SolucionDesde0_Notification>("soluciondesde0-notification")
    .WaitFor(rabbitMq)
    .WithReference(rabbitMq);

// MailServer
var mailServer = builder
    .AddContainer("maildev", "maildev/maildev:latest")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHttpEndpoint(port: 1080, targetPort: 1080, name: "web")
    .WithEndpoint(port: 1025, targetPort: 1025, name: "smtp");

// Product
var product = builder.AddProject<Projects.SolucionDesde0_API_Product>("soluciondesde0-api-product")
    .WaitFor(postgresDb) 
    .WithReference(postgresDb);

// Reference Db to Identity and Enviroment
identity
    .WaitFor(postgresDb)
    .WaitFor(rabbitMq)
    .WithReference(postgresDb)
    .WithReference(rabbitMq);

// Reference Identity & Redis to Gateway
gateway
    .WaitFor(identity)
    .WithReference(identity)
    .WaitFor(product)
    .WithReference(product)
    .WaitFor(redis)
    .WithReference(redis);



builder.Build().Run();

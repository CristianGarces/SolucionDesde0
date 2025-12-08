var builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL
var postgres = builder
    .AddPostgres("postgres")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithPgAdmin(pgAdmin => pgAdmin.WithHostPort(5050));

// Redis 
var redis = builder.AddRedis("redis")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithRedisInsight();

// Databases for microservices
var identityDb = postgres.AddDatabase("SolucionDesde0Db");
var productDb = postgres.AddDatabase("SolucionDesde0ProductDb");
var ordersDb = postgres.AddDatabase("SolucionDesde0OrdersDb");

// RabbitMq
var rabbitMq = builder.AddRabbitMQ("rabbitmq")
    .WithDataVolume(isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithManagementPlugin();

// MailServer
var mailServer = builder
    .AddContainer("maildev", "maildev/maildev:latest")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHttpEndpoint(port: 1080, targetPort: 1080, name: "web")
    .WithEndpoint(port: 1025, targetPort: 1025, name: "smtp");

// Identity Service
var identity = builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity")
    .WaitFor(identityDb)
    .WaitFor(rabbitMq)
    .WithReference(identityDb)
    .WithReference(rabbitMq);

// Product Service
var product = builder.AddProject<Projects.SolucionDesde0_API_Product>("soluciondesde0-api-product")
    .WaitFor(productDb)
    .WithReference(productDb);

var orders = builder.AddProject<Projects.SolucionDesde0_Api_Orders>("soluciondesde0-api-orders")
    .WaitFor(ordersDb)
    .WithReference(ordersDb);


// Notifications Service
var notifications = builder.AddProject<Projects.SolucionDesde0_Notification>("soluciondesde0-notification")
    .WaitFor(rabbitMq)
    .WithReference(rabbitMq);

var gateway = builder.AddProject<Projects.SolucionDesde0_API_Gateway>("soluciondesde0-api-gateway")
    .WaitFor(identity)
    .WithReference(identity)
    .WaitFor(product)
    .WithReference(product)
    .WaitFor(orders)
    .WithReference(orders)
    .WaitFor(redis)
    .WithReference(redis);

var frontend = builder.AddNpmApp("frontend", "../SolucionDesde0.web/soluciondesde0.web.client", "dev")
    .WithReference(gateway)
    .WaitFor(gateway);


builder.Build().Run();
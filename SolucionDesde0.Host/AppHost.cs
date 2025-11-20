var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.SolucionDesde0_API_Identity>("soluciondesde0-api-identity");

builder.Build().Run();

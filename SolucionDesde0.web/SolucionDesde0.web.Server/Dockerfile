# Consulte https://aka.ms/customizecontainer para aprender a personalizar su contenedor de depuración y cómo Visual Studio usa este Dockerfile para compilar sus imágenes para una depuración más rápida.

# Esta fase se usa cuando se ejecuta desde VS en modo rápido (valor predeterminado para la configuración de depuración)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Esta fase se usa para compilar el proyecto de servicio
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Directory.Packages.props", "."]
COPY ["soluciondesde0.web.client/soluciondesde0.web.client.esproj", "soluciondesde0.web.client/"]
COPY ["SolucionDesde0.web/SolucionDesde0.web.Server/SolucionDesde0.web.Server.csproj", "SolucionDesde0.web/SolucionDesde0.web.Server/"]
COPY ["soluciondesde0.web.client/soluciondesde0.web.client.esproj", "soluciondesde0.web.client/"]
RUN dotnet restore "./SolucionDesde0.web/SolucionDesde0.web.Server/SolucionDesde0.web.Server.csproj"
COPY . .
WORKDIR "/src/SolucionDesde0.web/SolucionDesde0.web.Server"
RUN dotnet build "./SolucionDesde0.web.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Esta fase se usa para publicar el proyecto de servicio que se copiará en la fase final.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SolucionDesde0.web.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Esta fase se usa en producción o cuando se ejecuta desde VS en modo normal (valor predeterminado cuando no se usa la configuración de depuración)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SolucionDesde0.web.Server.dll"]

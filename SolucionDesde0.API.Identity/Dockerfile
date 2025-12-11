# Consulte https://aka.ms/customizecontainer para aprender a personalizar su contenedor de depuración y cómo Visual Studio usa este Dockerfile para compilar sus imágenes para una depuración más rápida.

# Esta fase se usa cuando se ejecuta desde VS en modo rápido (valor predeterminado para la configuración de depuración)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Esta fase se usa para compilar el proyecto de servicio
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia todo el repositorio para asegurar que el .csproj y referencias existan
COPY . .

# Sitúate en el proyecto y restaura dependencias
WORKDIR /src/SolucionDesde0.API.Identity
RUN dotnet restore "SolucionDesde0.API.Identity.csproj"

# Publica la aplicación
RUN dotnet publish -c Release -o /app --no-restore

# Esta fase se usa en producción o cuando se ejecuta desde VS en modo normal (valor predeterminado cuando no se usa la configuración de depuración)
FROM base AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "SolucionDesde0.API.Identity.dll"]
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Tienda.Identity.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Cadena de conexión para migraciones
            optionsBuilder.UseNpgsql("Host=localhost;Port=54614;Username=postgres;Password=cpQdbh*MGTrRyc3!B(UQV5;Database=SolucionDesde0Db");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
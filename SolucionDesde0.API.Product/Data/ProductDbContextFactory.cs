using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SolucionDesde0.API.Product.Data
{
    public class ProductDbContextFactory : IDesignTimeDbContextFactory<ProductDbContext>
    {
        public ProductDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ProductDbContext>();

            // Cadena de conexion
            optionsBuilder.UseNpgsql("Host=localhost;Port=54614;Username=postgres;Password=cpQdbh*MGTrRyc3!B(UQV5;Database=SolucionDesde0Db");

            return new ProductDbContext(optionsBuilder.Options);
        }
    }
}
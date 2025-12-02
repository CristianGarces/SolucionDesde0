using Microsoft.EntityFrameworkCore;
using SolucionDesde0.API.Product.Models;

namespace SolucionDesde0.API.Product.Data
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options)
            : base(options)
        {
        }

        public DbSet<ProductEntity> Products => Set<ProductEntity>();
        public DbSet<Category> Categories => Set<Category>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsRequired();
                entity.Property(e => e.Description)
                    .HasMaxLength(500);
            });

            // Configure ProductEntity
            modelBuilder.Entity<ProductEntity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name)
                    .HasMaxLength(200)
                    .IsRequired();
                entity.Property(e => e.Description)
                    .HasMaxLength(1000);
                entity.Property(e => e.Price)
                    .HasPrecision(18, 2)
                    .IsRequired();
                entity.Property(e => e.Stock)
                    .IsRequired();
                entity.Property(e => e.CreatedByUserId)
                    .HasMaxLength(450)
                    .IsRequired();

                // Relaction Product --> Category
                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
using Microsoft.EntityFrameworkCore;
using SolucionDesde0.Api.Orders.Models;

namespace SolucionDesde0.API.Orders.Data
{
    public class OrdersDbContext : DbContext
    {
        public OrdersDbContext(DbContextOptions<OrdersDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .HasMaxLength(450)
                    .IsRequired();

                entity.Property(e => e.TotalAmount)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.ShippingAddress)
                    .HasMaxLength(500);

                entity.Property(e => e.ShippingCity)
                    .HasMaxLength(100);

                entity.Property(e => e.Notes)
                    .HasMaxLength(1000);

                entity.Property(e => e.Status)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                // Indexes
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);
            });

            // Configure OrderItem
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.ProductId)
                    .IsRequired();

                entity.Property(e => e.ProductName)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(e => e.UnitPrice)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Quantity)
                    .IsRequired();

                // Relación OrderItem → Order
                entity.HasOne(e => e.Order)
                    .WithMany(o => o.Items)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => e.OrderId);
            });
        }
    }
}
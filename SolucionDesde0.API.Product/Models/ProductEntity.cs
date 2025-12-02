namespace SolucionDesde0.API.Product.Models
{
    public class ProductEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string CreatedByUserId { get; set; }

        // Relación con categoría
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } 

    }
}
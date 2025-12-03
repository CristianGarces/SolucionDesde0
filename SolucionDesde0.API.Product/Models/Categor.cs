namespace SolucionDesde0.API.Product.Models
{
    public class Category 
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Realacion con productos 
        public ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
    }
}

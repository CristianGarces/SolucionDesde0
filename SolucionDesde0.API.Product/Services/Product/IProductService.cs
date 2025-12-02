using SolucionDesde0.API.Product.Dto;

namespace SolucionDesde0.API.Product.Services.Product
{
    public interface IProductService
    {
        Task<ProductResponse> CreateProductAsync(CreateProductRequest request, string userId);
        Task<ProductResponse> UpdateProductAsync(Guid id, UpdateProductRequest request);
        Task<bool> DeleteProductAsync(Guid id);
        Task<ProductResponse> GetProductByIdAsync(Guid id);
        Task<IEnumerable<ProductResponse>> GetAllProductsAsync();
        Task<IEnumerable<ProductResponse>> GetProductsByCategoryAsync(Guid categoryId);
        Task<bool> UpdateStockAsync(Guid productId, int quantityChange);
    }
}
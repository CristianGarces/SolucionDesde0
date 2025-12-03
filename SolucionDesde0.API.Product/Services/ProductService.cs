using Microsoft.EntityFrameworkCore;
using SolucionDesde0.API.Product.Data;
using SolucionDesde0.API.Product.Dto;
using SolucionDesde0.API.Product.Models;

namespace SolucionDesde0.API.Product.Services
{
    public class ProductService : IProductService
    {
        private readonly ProductDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ProductDbContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request, string userId)
        {
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
            {
                _logger.LogError("Category with ID {CategoryId} not found", request.CategoryId);
                return null;
            }

            var product = new ProductEntity
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Stock = request.Stock,
                CategoryId = request.CategoryId,
                CreatedByUserId = userId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Product created with ID: {ProductId}", product.Id);

            return MapToProductResponse(product, category);
        }

        public async Task<ProductResponse> UpdateProductAsync(Guid id, UpdateProductRequest request)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} not found", id);
                return null;
            }

            if (product.CategoryId != request.CategoryId)
            {
                var newCategory = await _context.Categories.FindAsync(request.CategoryId);
                if (newCategory == null)
                {
                    _logger.LogError("Category with ID {CategoryId} not found", request.CategoryId);
                    return null;
                }
                product.Category = newCategory;
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Stock = request.Stock;
            product.CategoryId = request.CategoryId;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Product updated with ID: {ProductId}", id);

            return MapToProductResponse(product, product.Category);
        }

        public async Task<bool> DeleteProductAsync(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} not found for deletion", id);
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Product deleted with ID: {ProductId}", id);
            return true;
        }

        public async Task<ProductResponse> GetProductByIdAsync(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} not found", id);
                return null;
            }

            return MapToProductResponse(product, product.Category);
        }

        public async Task<IEnumerable<ProductResponse>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .ToListAsync();

            return products.Select(p => MapToProductResponse(p, p.Category));
        }

        public async Task<IEnumerable<ProductResponse>> GetProductsByCategoryAsync(Guid categoryId)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();

            return products.Select(p => MapToProductResponse(p, p.Category));
        }

        public async Task<bool> UpdateStockAsync(Guid productId, int quantityChange)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} not found for stock update", productId);
                return false;
            }

            var newStock = product.Stock + quantityChange;
            if (newStock < 0)
            {
                _logger.LogWarning("Insufficient stock for product {ProductId}. Current: {CurrentStock}, Requested change: {QuantityChange}",
                    productId, product.Stock, quantityChange);
                return false;
            }

            product.Stock = newStock;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Stock updated for product {ProductId}. New stock: {NewStock}", productId, newStock);
            return true;
        }

        private ProductResponse MapToProductResponse(ProductEntity product, Category category)
        {
            return new ProductResponse(
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.Stock,
                product.CategoryId,
                category?.Name ?? "None",
                product.CreatedByUserId
            );
        }
    }
}
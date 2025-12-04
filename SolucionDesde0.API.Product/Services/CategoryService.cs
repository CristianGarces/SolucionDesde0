using Microsoft.EntityFrameworkCore;
using SolucionDesde0.API.Product.Data;
using SolucionDesde0.API.Product.Dto;
using SolucionDesde0.API.Product.Models;

namespace SolucionDesde0.API.Product.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ProductDbContext _context;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ProductDbContext context, ILogger<CategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories
                .Include(c => c.Products)
                .AsNoTracking()
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} categories", categories.Count);

            return categories.Select(MapToCategoryResponse);
        }

        public async Task<(CategoryResponse? Data, string? Error)> GetCategoryByIdAsync(Guid id)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found", id);
                return (null, $"Category with ID {id} not found");
            }

            _logger.LogInformation("Retrieved category with ID: {CategoryId}", id);
            return (MapToCategoryResponse(category), null);
        }

        public async Task<(CategorySimpleResponse? Data, string? Error)> CreateCategoryAsync(CreateCategoryRequest request)
        {
            var normalizedName = request.Name!.Trim().ToLower();
            var existingCategory = await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Name.ToLower() == normalizedName);

            if (existingCategory != null)
            {
                _logger.LogError("Category with name '{CategoryName}' already exists", request.Name);
                return (null, $"Category with name '{request.Name}' already exists");
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Description = request.Description?.Trim()
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Category created with ID: {CategoryId} and name: {CategoryName}",
                category.Id, category.Name);

            return (MapToCategorySimpleResponse(category), null);
        }

        public async Task<(CategorySimpleResponse? Data, string? Error)> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found for update", id);
                return (null, $"Category with ID {id} not found");
            }

            var normalizedName = request.Name!.Trim().ToLower(); 
            var existingCategory = await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c =>
                    c.Id != id &&
                    c.Name.ToLower() == normalizedName);

            if (existingCategory != null)
            {
                _logger.LogError("Category with name '{CategoryName}' already exists", request.Name);
                return (null, $"Category with name '{request.Name}' already exists");
            }

            var oldName = category.Name;
            category.Name = request.Name.Trim();
            category.Description = request.Description?.Trim();

            await _context.SaveChangesAsync();

            _logger.LogInformation("Category with ID {CategoryId} updated. Old name: {OldName}, New name: {NewName}",
                id, oldName, category.Name);

            return (MapToCategorySimpleResponse(category), null);
        }

        public async Task<(bool Success, string? Error)> DeleteCategoryAsync(Guid id)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found for deletion", id);
                return (false, $"Category with ID {id} not found");
            }

            if (category.Products.Any())
            {
                _logger.LogError("Cannot delete category with ID {CategoryId} because it has {ProductCount} associated products",
                    id, category.Products.Count);
                return (false, $"Cannot delete category with {category.Products.Count} associated products");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Category with ID {CategoryId} and name '{CategoryName}' deleted",
                id, category.Name);
            return (true, null);
        }

        private CategoryResponse MapToCategoryResponse(Category category)
        {
            return new CategoryResponse(
                category.Id,
                category.Name,
                category.Description ?? string.Empty,
                category.Products.Count
            );
        }

        private CategorySimpleResponse MapToCategorySimpleResponse(Category category)
        {
            return new CategorySimpleResponse(
                category.Id,
                category.Name,
                category.Description ?? string.Empty
            );
        }
    }
}
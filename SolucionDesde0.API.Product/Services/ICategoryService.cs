using SolucionDesde0.API.Product.Dto;

namespace SolucionDesde0.API.Product.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();

        Task<(CategoryResponse? Data, string? Error)> GetCategoryByIdAsync(Guid id);

        Task<(CategorySimpleResponse? Data, string? Error)> CreateCategoryAsync(CreateCategoryRequest request);

        Task<(CategorySimpleResponse? Data, string? Error)> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request);

        Task<(bool Success, string? Error)> DeleteCategoryAsync(Guid id);
    }
}
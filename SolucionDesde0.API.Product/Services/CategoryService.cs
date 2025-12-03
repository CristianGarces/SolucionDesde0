using SolucionDesde0.API.Product.Dto;

namespace SolucionDesde0.API.Product.Services
{
    public class CategoryService : ICategoryService
    {
        public Task<CategorySimpleResponse> CreateCategoryAsync(CreateCategoryRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteCategoryAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<CategoryResponse> GetCategoryByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<CategorySimpleResponse> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
        {
            throw new NotImplementedException();
        }
    }
}

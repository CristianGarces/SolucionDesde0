using SolucionDesde0.API.Product.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SolucionDesde0.API.Product.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();
        Task<CategoryResponse> GetCategoryByIdAsync(Guid id);
        Task<CategorySimpleResponse> CreateCategoryAsync(CreateCategoryRequest request);
        Task<CategorySimpleResponse> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request);
        Task<bool> DeleteCategoryAsync(Guid id);
    }
}
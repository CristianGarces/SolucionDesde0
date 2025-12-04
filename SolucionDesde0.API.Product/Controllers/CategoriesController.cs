using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Product.Dto;
using SolucionDesde0.API.Product.Services;

namespace SolucionDesde0.API.Product.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoriesController> _logger;
        private readonly IValidator<CreateCategoryRequest> _createValidator;
        private readonly IValidator<UpdateCategoryRequest> _updateValidator;

        public CategoriesController(
            ICategoryService categoryService,
            ILogger<CategoriesController> logger,
            IValidator<CreateCategoryRequest> createValidator,
            IValidator<UpdateCategoryRequest> updateValidator)
        {
            _categoryService = categoryService;
            _logger = logger;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetCategoryById(Guid id)
        {
            var (category, error) = await _categoryService.GetCategoryByIdAsync(id);

            if (error != null)
            {
                return NotFound(error);
            }

            return Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategorySimpleResponse>> CreateCategory(CreateCategoryRequest request)
        {
            var validationResult = await _createValidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();

                _logger.LogWarning("Validation failed for CreateCategory: {Errors}", string.Join(", ", errors));
                return BadRequest(new { errors });
            }

            var (category, error) = await _categoryService.CreateCategoryAsync(request);

            if (error != null)
            {
                _logger.LogWarning("Business rule violation for CreateCategory: {Error}", error);
                return BadRequest(new { error });
            }

            _logger.LogInformation("Category created successfully with ID: {CategoryId}", category!.Id);
            return CreatedAtAction(
                nameof(GetCategoryById),
                new { id = category.Id },
                category
            );
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategorySimpleResponse>> UpdateCategory(Guid id, UpdateCategoryRequest request)
        {
            var validationResult = await _updateValidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();

                _logger.LogWarning("Validation failed for UpdateCategory (ID: {CategoryId}): {Errors}",
                    id, string.Join(", ", errors));
                return BadRequest(new { errors });
            }

            var (category, error) = await _categoryService.UpdateCategoryAsync(id, request);

            if (error != null)
            {
                if (error.Contains("not found"))
                {
                    _logger.LogWarning("Category not found for update: {CategoryId}", id);
                    return NotFound(new { error });
                }

                _logger.LogWarning("Business rule violation for UpdateCategory (ID: {CategoryId}): {Error}",
                    id, error);
                return BadRequest(new { error });
            }

            _logger.LogInformation("Category updated successfully: {CategoryId}", id);
            return Ok(category);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var (success, error) = await _categoryService.DeleteCategoryAsync(id);

            if (!success)
            {
                if (error!.Contains("not found"))
                {
                    _logger.LogWarning("Category not found for deletion: {CategoryId}", id);
                    return NotFound(new { error });
                }

                _logger.LogWarning("Business rule violation for DeleteCategory (ID: {CategoryId}): {Error}",
                    id, error);
                return BadRequest(new { error });
            }

            _logger.LogInformation("Category deleted successfully: {CategoryId}", id);
            return NoContent();
        }
    }
}
using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.API.Product.Dto;
using SolucionDesde0.API.Product.Services;
using System.IdentityModel.Tokens.Jwt;

namespace SolucionDesde0.API.Product.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;
        private readonly IValidator<CreateProductRequest> _createValidator;
        private readonly IValidator<UpdateProductRequest> _updateValidator;

        public ProductsController(
            IProductService productService,
            ILogger<ProductsController> logger,
            IValidator<CreateProductRequest> createValidator,
            IValidator<UpdateProductRequest> updateValidator)
        {
            _productService = productService;
            _logger = logger;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAllProducts()
        {
            _logger.LogInformation("Getting all products");
            var products = await _productService.GetAllProductsAsync();
            _logger.LogInformation("Retrieved {Count} products", products.Count());
            return Ok(products);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponse>> GetProductById(Guid id)
        {
            _logger.LogInformation("Getting product with ID: {ProductId}", id);
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} not found", id);
                return NotFound($"Product with ID {id} not found");
            }

            _logger.LogInformation("Product with ID {ProductId} retrieved successfully", id);
            return Ok(product);
        }

        // GET: api/products/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProductsByCategory(Guid categoryId)
        {
            _logger.LogInformation("Getting products for category ID: {CategoryId}", categoryId);
            var products = await _productService.GetProductsByCategoryAsync(categoryId);
            _logger.LogInformation("Retrieved {Count} products for category {CategoryId}", products.Count(), categoryId);
            return Ok(products);
        }

        // POST: api/products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductResponse>> CreateProduct(CreateProductRequest request)
        {
            _logger.LogInformation("Starting product creation request");

            // Validación
            var validationResult = await _createValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                _logger.LogWarning("Validation failed for product creation: {Errors}", string.Join(", ", errors));
                return BadRequest(new { errors });
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("Unauthorized attempt to create product");
                return Unauthorized("User not authenticated");
            }

            _logger.LogInformation("Creating product for user ID: {UserId}", userId);
            var product = await _productService.CreateProductAsync(request, userId);

            if (product == null)
            {
                _logger.LogWarning("Category with ID {CategoryId} not found for product creation", request.CategoryId);
                return NotFound($"Category with ID {request.CategoryId} not found");
            }

            _logger.LogInformation("Product created successfully with ID: {ProductId}", product.Id);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductResponse>> UpdateProduct(Guid id, UpdateProductRequest request)
        {
            _logger.LogInformation("Starting product update for ID: {ProductId}", id);

            // Validación
            var validationResult = await _updateValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                _logger.LogWarning("Validation failed for product update (ID: {ProductId}): {Errors}",
                    id, string.Join(", ", errors));
                return BadRequest(new { errors });
            }

            var product = await _productService.UpdateProductAsync(id, request);
            if (product == null)
            {
                _logger.LogWarning("Product with ID {ProductId} or Category with ID {CategoryId} not found for update",
                    id, request.CategoryId);
                return NotFound($"Category with ID {request.CategoryId} not found");
            }

            _logger.LogInformation("Product with ID {ProductId} updated successfully", id);
            return Ok(product);
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            _logger.LogInformation("Deleting product with ID: {ProductId}", id);
            var result = await _productService.DeleteProductAsync(id);

            if (!result)
            {
                _logger.LogWarning("Product with ID {ProductId} not found for deletion", id);
                return NotFound($"Product with ID {id} not found");
            }

            _logger.LogInformation("Product with ID {ProductId} deleted successfully", id);
            return NoContent();
        }

        // PATCH: api/products/{id}/stock
        [HttpPatch("{id}/stock")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateStock(Guid id, [FromBody] int quantityChange)
        {
            _logger.LogInformation("Updating stock for product ID: {ProductId}, quantity change: {QuantityChange}",
                id, quantityChange);

            var result = await _productService.UpdateStockAsync(id, quantityChange);

            if (!result)
            {
                _logger.LogWarning("Unable to update stock for product ID {ProductId}", id);
                return BadRequest("Unable to update stock");
            }

            _logger.LogInformation("Stock updated successfully for product ID {ProductId}", id);
            return Ok();
        }
    }
}
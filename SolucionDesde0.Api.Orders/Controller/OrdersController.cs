using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolucionDesde0.Api.Orders.Services;
using System.Security.Claims;
using static SolucionDesde0.Api.Orders.Dto.OrderDtos;

namespace SolucionDesde0.API.Orders.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{v:apiVersion}/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrdersController> _logger;
        private readonly IValidator<CreateOrderRequest> _createOrderValidator;
        private readonly IValidator<UpdateOrderStatusRequest> _updateStatusValidator;

        public OrdersController(
            IOrderService orderService,
            ILogger<OrdersController> logger,
            IValidator<CreateOrderRequest> createOrderValidator,
            IValidator<UpdateOrderStatusRequest> updateStatusValidator)
        {
            _orderService = orderService;
            _logger = logger;
            _createOrderValidator = createOrderValidator;
            _updateStatusValidator = updateStatusValidator;
        }

        private string GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID not found in token claims");
                throw new UnauthorizedAccessException("User ID not found");
            }

            return userId;
        }

        // ==================== USUARIO ====================

        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderListResponse>>> GetUserOrders()
        {
            var userId = GetUserId();
            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponse>> GetById(Guid id)
        {
            var userId = GetUserId();
            var (order, error) = await _orderService.GetByIdAsync(id, userId);

            if (error != null)
            {
                if (error.Contains("Access denied"))
                    return Forbid();

                return NotFound(new { error });
            }

            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest request)
        {
            var validationResult = await _createOrderValidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage);
                return BadRequest(new { errors });
            }

            var userId = GetUserId();
            var (order, error) = await _orderService.CreateAsync(userId, request);

            if (error != null)
            {
                if (error.Contains("service unavailable"))
                    return StatusCode(503, new { error });

                return BadRequest(new { error });
            }

            _logger.LogInformation("Order created successfully: {OrderId}", order!.Id);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var userId = GetUserId();
            var (success, error) = await _orderService.CancelAsync(id, userId);

            if (!success)
            {
                if (error!.Contains("Access denied"))
                    return StatusCode(403, new
                    {
                        message = "You cannot cancel another user's order"
                    });

                if (error.Contains("not found"))
                    return NotFound(new { error });

                return BadRequest(new { error });
            }

            _logger.LogInformation("Order cancelled: {OrderId}", id);
            return NoContent();
        }

        // ==================== ADMIN ====================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<OrderListResponse>>> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrderResponse>> GetByIdForAdmin(Guid id)
        {
            var (order, error) = await _orderService.GetByIdForAdminAsync(id);

            if (error != null)
                return NotFound(new { error });

            return Ok(order);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
        {
            var validationResult = await _updateStatusValidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage);
                return BadRequest(new { errors });
            }

            var (success, error) = await _orderService.UpdateStatusAsync(id, request.Status);

            if (!success)
                return BadRequest(new { error });

            _logger.LogInformation("Order status updated: {OrderId} -> {Status}", id, request.Status);
            return NoContent();
        }
    }
}
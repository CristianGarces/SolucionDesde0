using Microsoft.EntityFrameworkCore;
using SolucionDesde0.Api.Orders.Models;
using SolucionDesde0.Api.Orders.Services;
using SolucionDesde0.API.Orders.Data;
using static SolucionDesde0.Api.Orders.Dto.OrderDtos;

namespace SolucionDesde0.API.Orders.Services
{
    public class OrderService : IOrderService
    {
        private readonly OrdersDbContext _context;
        private readonly ILogger<OrderService> _logger;

        public OrderService(OrdersDbContext context, ILogger<OrderService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<OrderListResponse>> GetUserOrdersAsync(string userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderListResponse(
                    o.Id,
                    o.Status.ToString(),
                    o.TotalAmount,
                    o.Items.Count,
                    o.CreatedAt))
                .ToListAsync();

            return orders;
        }

        public async Task<(OrderResponse? Data, string? Error)> GetByIdAsync(Guid id, string userId)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return (null, "Order not found");

            if (order.UserId != userId)
                return (null, "Access denied");

            return (MapToResponse(order), null);
        }

        public async Task<(OrderResponse? Data, string? Error)> CreateAsync(string userId, CreateOrderRequest request)
        {
            var order = new Order
            {
                UserId = userId,
                ShippingAddress = request.ShippingAddress,
                ShippingCity = request.ShippingCity,
                Notes = request.Notes,
                Status = OrderStatus.Pending,
                Items = new List<OrderItem>(),
                TotalAmount = 0
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order created: {OrderId} for user {UserId}", order.Id, userId);

            return (MapToResponse(order), null);
        }

        public async Task<(bool Success, string? Error)> CancelAsync(Guid id, string userId)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return (false, "Order not found");

            if (order.UserId != userId)
                return (false, "Access denied");

            if (order.Status is not (OrderStatus.Pending or OrderStatus.Confirmed))
                return (false, "Order cannot be cancelled at this stage");

            order.Status = OrderStatus.Cancelled;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Order cancelled: {OrderId}", id);

            return (true, null);
        }

        public async Task<IEnumerable<OrderListResponse>> GetAllAsync()
        {
            var orders = await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderListResponse(
                    o.Id,
                    o.Status.ToString(),
                    o.TotalAmount,
                    o.Items.Count,
                    o.CreatedAt))
                .ToListAsync();

            return orders;
        }

        public async Task<(OrderResponse? Data, string? Error)> GetByIdForAdminAsync(Guid id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return (null, "Order not found");

            return (MapToResponse(order), null);
        }

        public async Task<(bool Success, string? Error)> UpdateStatusAsync(Guid id, OrderStatus newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return (false, "Order not found");

            if (!IsValidStatusTransition(order.Status, newStatus))
                return (false, $"Cannot transition from {order.Status} to {newStatus}");

            order.Status = newStatus;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Order status updated: {OrderId} -> {Status}", id, newStatus);

            return (true, null);
        }

        private bool IsValidStatusTransition(OrderStatus current, OrderStatus next)
        {
            return (current, next) switch
            {
                (OrderStatus.Pending, OrderStatus.Confirmed) => true,
                (OrderStatus.Pending, OrderStatus.Cancelled) => true,
                (OrderStatus.Confirmed, OrderStatus.Processing) => true,
                (OrderStatus.Confirmed, OrderStatus.Cancelled) => true,
                (OrderStatus.Processing, OrderStatus.Shipped) => true,
                (OrderStatus.Shipped, OrderStatus.Delivered) => true,
                _ => false
            };
        }

        private OrderResponse MapToResponse(Order order) => new(
            order.Id,
            order.UserId,
            order.Status.ToString(),
            order.TotalAmount,
            order.ShippingAddress,
            order.ShippingCity,
            order.Notes,
            order.CreatedAt,
            order.Items.Select(i => new OrderItemResponse(
                i.Id, i.ProductId, i.ProductName, i.UnitPrice, i.Quantity, i.Subtotal)));
    }
}
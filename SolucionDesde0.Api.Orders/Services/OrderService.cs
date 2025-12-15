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
        private readonly IHttpClientFactory _httpClientFactory;

        public OrderService(
            OrdersDbContext context,
            ILogger<OrderService> logger,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
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

        public async Task<(OrderResponse? Data, string? Error)> CreateAsync(
            string userId,
            CreateOrderRequest request)
        {
            var httpClient = _httpClientFactory.CreateClient("ProductService");
            var successfulReductions = new List<(Guid ProductId, int Quantity)>();

            // Reducir stock para cada producto
            foreach (var item in request.Items)
            {
                var response = await httpClient.PatchAsJsonAsync(
                    $"api/v1/products/{item.ProductId}/stock",
                    -item.Quantity);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();

                    await CompensateStockReductions(httpClient, successfulReductions);
                    return (null, $"No hay stock suficiente para {item.ProductName}");
                }

                successfulReductions.Add((item.ProductId, item.Quantity));
            }

            // Crear la orden
            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ShippingAddress = request.ShippingAddress,
                ShippingCity = request.ShippingCity,
                Notes = request.Notes,
                Status = OrderStatus.Pending,
                Items = new List<OrderItem>(),
                CreatedAt = DateTime.UtcNow
            };

            decimal totalAmount = 0;
            foreach (var item in request.Items)
            {
                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    ProductName = item.ProductName
                };
                order.Items.Add(orderItem);
                totalAmount += orderItem.Subtotal;
            }
            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order created: {OrderId} for user {UserId}", order.Id, userId);
            return (MapToResponse(order), null);
        }

        private async Task CompensateStockReductions(
            HttpClient httpClient,
            List<(Guid ProductId, int Quantity)> reductions)
        {
            foreach (var (productId, quantity) in reductions)
            {
                await httpClient.PatchAsJsonAsync(
                    $"api/v1/products/{productId}/stock",
                    quantity);
            }
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

            order.Status = newStatus;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Order status updated: {OrderId} -> {Status}", id, newStatus);

            return (true, null);
        }

        private OrderResponse MapToResponse(Order order) => new(
            order.Id,
            order.UserId,
            order.Status.ToString(),
            order.TotalAmount,
            order.ShippingAddress,
            order.ShippingCity,
            order.Notes,
            order.CreatedAt.ToLocalTime(),
            order.Items.Select(i => new OrderItemResponse(
                i.Id, i.ProductId, i.ProductName, i.UnitPrice, i.Quantity, i.Subtotal)));
    }
}
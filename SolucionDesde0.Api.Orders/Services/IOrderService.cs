using SolucionDesde0.Api.Orders.Models;
using static SolucionDesde0.Api.Orders.Dto.OrderDtos;

namespace SolucionDesde0.Api.Orders.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderListResponse>> GetUserOrdersAsync(string userId);
        Task<(OrderResponse? Data, string? Error)> GetByIdAsync(Guid id, string userId);
        Task<(OrderResponse? Data, string? Error)> CreateAsync(string userId, CreateOrderRequest request);
        Task<(bool Success, string? Error)> CancelAsync(Guid id, string userId);
        Task<IEnumerable<OrderListResponse>> GetAllAsync();
        Task<(OrderResponse? Data, string? Error)> GetByIdForAdminAsync(Guid id);
        Task<(bool Success, string? Error)> UpdateStatusAsync(Guid id, OrderStatus newStatus);
    }
}
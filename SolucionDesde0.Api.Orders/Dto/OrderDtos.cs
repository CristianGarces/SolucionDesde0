using SolucionDesde0.Api.Orders.Models;

namespace SolucionDesde0.Api.Orders.Dto
{
    public class OrderDtos
    {
        public record OrderResponse(
        Guid Id,
        string UserId,
        string Status,
        decimal TotalAmount,
        string? ShippingAddress,
        string? ShippingCity,
        string? Notes,
        DateTime CreatedAt,
        IEnumerable<OrderItemResponse> Items);

        public record OrderListResponse(
            Guid Id,
            string Status,
            decimal TotalAmount,
            int ItemCount,
            DateTime CreatedAt);

        public record OrderItemResponse(
            Guid Id,
            Guid ProductId,
            string ProductName,
            decimal UnitPrice,
            int Quantity,
            decimal Subtotal);

        public record CreateOrderRequest(
            string? ShippingAddress,
            string? ShippingCity,
            string? ShippingZipCode,
            string? Notes,
            IEnumerable<CreateOrderItemRequest> Items);

        public record CreateOrderItemRequest(
            Guid ProductId,
            int Quantity,
            decimal UnitPrice,
            string ProductName);

        public record UpdateOrderStatusRequest(OrderStatus Status);
    }
}

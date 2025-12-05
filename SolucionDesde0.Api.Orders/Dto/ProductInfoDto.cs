namespace SolucionDesde0.API.Orders.Dto
{
    public record ProductInfoDto(
        Guid Id,
        string Name,
        decimal Price,
        int Stock);
}
using System;

namespace SolucionDesde0.API.Product.Dto
{
    public record CreateProductRequest(
        string Name,
        string Description,
        decimal Price,
        int Stock,
        Guid CategoryId);

    public record UpdateProductRequest(
        string Name,
        string Description,
        decimal Price,
        int Stock,
        Guid CategoryId);

    public record ProductResponse(
        Guid Id,
        string Name,
        string Description,
        decimal Price,
        int Stock,
        Guid CategoryId,
        string CategoryName,
        string CreatedByUserId);
}
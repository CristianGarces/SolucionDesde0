using System;

namespace SolucionDesde0.API.Product.Dto
{
    public record CreateCategoryRequest(string Name, string Description);

    public record UpdateCategoryRequest(string Name, string Description);

    public record CategoryResponse(Guid Id, string Name, string Description, int ProductCount);

    public record CategorySimpleResponse(Guid Id, string Name, string Description);
}
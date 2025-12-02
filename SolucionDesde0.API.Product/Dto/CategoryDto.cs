using System;

namespace SolucionDesde0.API.Product.Dto
{
    //create / update
    public record CategoryRequest(
        string Name,
        string Description);

    public record CategoryResponse(
        Guid Id,
        string Name,
        string Description);
}
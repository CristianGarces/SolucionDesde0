using FluentValidation;
using static SolucionDesde0.Api.Orders.Dto.OrderDtos;

namespace SolucionDesde0.API.Orders.Validations
{
    public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
    {
        public UpdateOrderStatusRequestValidator()
        {
            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid order status");
        }
    }
}
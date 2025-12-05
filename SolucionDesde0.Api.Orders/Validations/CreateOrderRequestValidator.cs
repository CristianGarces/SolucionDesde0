using FluentValidation;
using static SolucionDesde0.Api.Orders.Dto.OrderDtos;

namespace SolucionDesde0.API.Orders.Validations
{
    public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
    {
        public CreateOrderRequestValidator()
        {
            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Order must have at least one item")
                .Must(items => items.All(i => i.Quantity > 0))
                .WithMessage("All items must have a quantity greater than 0");

            RuleFor(x => x.ShippingAddress)
                .MaximumLength(500).WithMessage("Shipping address cannot exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.ShippingAddress));

            RuleFor(x => x.ShippingCity)
                .MaximumLength(100).WithMessage("Shipping city cannot exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.ShippingCity));

            RuleFor(x => x.Notes)
                .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Notes));
        }
    }
}
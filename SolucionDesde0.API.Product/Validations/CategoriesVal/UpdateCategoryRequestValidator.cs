using FluentValidation;
using SolucionDesde0.API.Product.Dto;

namespace SolucionDesde0.API.Product.Validations.CategoriesVal
{
    public class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
    {
        public UpdateCategoryRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(100).WithMessage("Category name cannot exceed 100 characters.")
                .Matches(@"^[a-zA-Z0-9\s\-_]+$").WithMessage("Category name can only contain letters, numbers, spaces, hyphens and underscores.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }
}

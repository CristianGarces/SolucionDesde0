using FluentValidation;
using SolucionDesde0.API.Identity.Dto.Users;

namespace SolucionDesde0.API.Identity.Validations.Users
{
    public class UpdateValidator : AbstractValidator<UpdateUserRequest>
    {
        public UpdateValidator() 
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email is required.");

            RuleFor(x => x.RoleId)
                .NotEmpty().WithMessage("RoleId is required.");
        }
    }
}

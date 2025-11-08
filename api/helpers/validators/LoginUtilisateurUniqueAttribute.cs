using System.ComponentModel.DataAnnotations;
using mutuelleApi.data;

namespace mutuelleApi.validators
{
    public class LoginUtilisateurUniqueAttribute : ValidationAttribute
    {

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value != null)
            {
                var idProperty = validationContext.ObjectType.GetProperty("Id");
                var idValue = idProperty?.GetValue(validationContext.ObjectInstance);
                DataContext? _context = validationContext.GetService(typeof(DataContext)) as DataContext;
                if (_context == null)
                {
                    return new ValidationResult("Impossible de se connecter à la base de données.");
                }
                var entity = _context?.Utilisateurs?.FirstOrDefault(x => x.Login == value.ToString() && x.Id != (int?)idValue);

                if (entity == null)
                {
                    return ValidationResult.Success;
                }
            }
           
            return new ValidationResult(ErrorMessage);
        }

    }
}
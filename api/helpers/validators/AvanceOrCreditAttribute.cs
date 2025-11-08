using System.ComponentModel.DataAnnotations;
using mutuelleApi.data;

namespace mutuelleApi.validators
{
    public class AvanceOrCreditAttribute(string comparisonProperty) : ValidationAttribute
    {
        private readonly string _comparisonProperty = comparisonProperty;


        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var property = validationContext.ObjectType.GetProperty(_comparisonProperty);
            var propertyValue = property?.GetValue(validationContext.ObjectInstance);
       
            if (value is null)
            {
                if(propertyValue is null) 
                {
                    return new ValidationResult(ErrorMessage);
                }
                return ValidationResult.Success;
            } 
            else if(propertyValue is null) 
            {
                return ValidationResult.Success;
            }
            return new ValidationResult(ErrorMessage);
        }

    }
}



using mutuelleApi.validators;
using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class UpdateUserRequestDto
    {
        [Required(ErrorMessage = "Le nom est obligatoire!")]
        public string Nom { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le sexe est obligatoire!")]
        public string Sexe { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le role est obligatoire!")]
        public string Role { get; set; } = string.Empty;
    }
}

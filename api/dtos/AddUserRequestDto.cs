using System.ComponentModel.DataAnnotations;
using mutuelleApi.enums;
using mutuelleApi.validators;

namespace mutuelleApi.dtos
{
    public class AddUserRequestDto
    {
        [Required(ErrorMessage = "Le login est obligatoire!")]
        [LoginUtilisateurUniqueAttribute(ErrorMessage = "Le login doit être unique!")]
        public string Login { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le nom est obligatoire!")]
        public string Nom { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le sexe est obligatoire!")]
        public string Sexe { get; set; } = string.Empty;
    }
}
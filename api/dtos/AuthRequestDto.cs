using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class AuthRequestDto
    {
        [Required(ErrorMessage = "Le login est obligatoire!")]
        public string Login { get; set; } = string.Empty;
        [Required(ErrorMessage ="Le mot de passe est obligatoire!")]
        public string Password { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class ChangeUserPasswordRequestDto
    {
        [Required(ErrorMessage = "L'ancien mot de passe est obligatoire.")]
        public string OldPassword { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le nouveau mot de passe est obligatoire.")]
        public string NewPassword { get; set; } = string.Empty;

    }
}

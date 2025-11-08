using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class ChangePasswordRequest
    {
        [Required(ErrorMessage = "L'ancien mot de passe est obligatoire!")]
        public string AncienMotDePasse { get; set; } = string.Empty;
        [Required(ErrorMessage ="Le mot de passe est obligatoire!")]
        public string MotDePasse { get; set; } = string.Empty;
        [Required(ErrorMessage ="La confirmation du mot de passe est obligatoire!")]
        public string ConfirmMotDePasse { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class UpdateUserStatusRequest
    {
        [Required(ErrorMessage ="Le status de l'utilisateur est obligatoire.")]
        public string Status { get; set; } = string.Empty;
    }
}

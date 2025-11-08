using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class UpdateUtilisateurActifRequestDto
    {
        [Required]
        public bool EstActif { get; set; } 
    }
}
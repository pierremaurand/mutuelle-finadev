using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class CaisseRequestDto
    {
        [Required(ErrorMessage = "L'utilisateur de la caisse est obligatoire!")]
        public int AgentId { get; set; }
        [Required(ErrorMessage = "La date de la caisse est obligatoire!")]
        public string DateCaisse { get; set; } = string.Empty;
    }
}
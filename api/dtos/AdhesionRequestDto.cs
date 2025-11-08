using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class AdhesionRequestDto
    {
        [Required(ErrorMessage = "Le membre est obligatoire!")]
        public int MembreId { get; set; } 
        [Required(ErrorMessage = "Le montant est obligatoire!")]
        public float Montant { get; set; } 
		[Required(ErrorMessage = "La date d'adhésion est obligatoire!")]
		public string DateAdhesion { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class AssistanceRequestDto
    {
        [Required(ErrorMessage = "Le membre est obligatoire!")]
        public int MembreId { get; set; } 
        [Required(ErrorMessage = "Le montant est obligatoire!")]
        public float Montant { get; set; } 
		[Required(ErrorMessage = "La date de l'assistance est obligatoire!")]
		public string DateAssistance { get; set; } = string.Empty;
		[Required(ErrorMessage = "Le motif de l'assistance est obligatoire!")]
		public string MotifAssistance { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations;
using mutuelleApi.validators;

namespace mutuelleApi.dtos
{
    public class RemboursementEcheanceDto
    {
        [Required(ErrorMessage = "L'id de l'échéance est obligatoire.")]
        public int Id { get; set; }
        [AvanceOrCredit("CreditId",ErrorMessage = "L'id de l'avance est obligatoire.")]
        public int? AvanceId { get; set; }
        [AvanceOrCredit("AvanceId",ErrorMessage = "L'id du crédit est obligatoire.")]
        public int? CreditId { get; set; }
        [Required(ErrorMessage = "La date de paiement est obligatoire.")]
		public string DatePaiement { get; set; } = string.Empty;
    }
}
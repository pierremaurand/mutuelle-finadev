using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class EcheanceCreditRequestDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "La date de l'échéance est obligatoire.")]
        public string DateEcheance { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le montant du capital est obligatoire")]
        public float MontantCapital { get; set; }
        [Required(ErrorMessage = "Le montant de la commission est obligatoire.")]
        public float MontantCommission { get; set; }
        [Required(ErrorMessage = "Le montant des intérêts est obligatoire.")]
        public float MontantInterets { get; set; }
        [Required(ErrorMessage = "Le crédit est obligatoire.")]
        public int CreditId { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class EcheanceAvanceRequestDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "La date de l'échéance est obligatoire.")]
        public string DateEcheance { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le montant du capital est obligatoire")]
        public float MontantCapital { get; set; }
        [Required(ErrorMessage = "L'avance est obligatoire.")]
        public int AvanceId { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class CotisationRequestDto
    {
        [Required(ErrorMessage = "Le membre est obligatoire!")]
        public int MembreId { get; set; }
        [Required(ErrorMessage = "La date de la cotisation est obligatoire!")]
        public string DateCotisation { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le salaire du mois est obligatoire!")]
        public double Salaire { get; set; }
    }
}
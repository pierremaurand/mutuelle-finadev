using System.ComponentModel.DataAnnotations;

namespace mutuelleApi.dtos
{
    public class BanqueRequestDto
    {
        [Required(ErrorMessage = "Le nom de la banque est obligatoire!")]
        public string Nom { get; set; } = string.Empty;
    }
}
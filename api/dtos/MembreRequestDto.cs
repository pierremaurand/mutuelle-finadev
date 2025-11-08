using System.ComponentModel.DataAnnotations;
using mutuelleApi.enums;

namespace mutuelleApi.dtos
{
    public class MembreRequestDto
    {
        [Required(ErrorMessage = "Le nom est obligatoire!")]
        public string Nom { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le sexe est obligatoire!")]
        public Sexe Sexe { get; set; } = Sexe.Masculin;
        [Required(ErrorMessage = "La date de naissance est obligatoire!")]
        public string DateNaissance { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le lieu de naissance est obligatoire!")]
        public string LieuNaissance { get; set; } = string.Empty;
        [Required(ErrorMessage = "L'agence est obligatoire!")]
        public int AgenceId { get; set; }
        [Required(ErrorMessage = "La date d'adhésion est obligatoire!")]
        public string DateAdhesion { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le numéro de téléphone est obligatoire!")]
        public string Telephone { get; set; } = string.Empty;
        [Required(ErrorMessage = "L'adresse email est obligatoire!")]
        public string Email { get; set; } = string.Empty;

        public string Photo { get; set; } = string.Empty;
        public bool EstActif { get; set; } = true;
    }
}
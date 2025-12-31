using System.ComponentModel.DataAnnotations;
using mutuelleApi.enums;

namespace mutuelleApi.models
{
    public class Utilisateur : BaseEntity
    {
        public string Login { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Sexe { get; set; } = string.Empty;
        public byte[] MotDePasse { get; set; } = [];
        public byte[] ClesMotDePasse { get; set; } = [];
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;
    }
}
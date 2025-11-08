using mutuelleApi.enums;

namespace mutuelleApi.dtos
{
    public class UtilisateurDto
    {
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public Sexe Sexe { get; set; }
        public Role Role { get; set; }
        public bool EstActif { get; set; } = true;
        public string Photo { get; set; } = string.Empty;
    }
}
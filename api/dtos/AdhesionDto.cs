

namespace mutuelleApi.dtos
{
    public class AdhesionDto
    {
        public int Id { get;  set; }
        public int AdhesionId { get;  set; }
        public int MembreId { get; set; } 
        public double Montant { get; set; } 
		public string DateAdhesion { get; set; } = string.Empty;
		public string Nom { get; set; } = string.Empty;
		public string NomSexe { get; set; } = string.Empty;
		public string Photo { get; set; } = string.Empty;
        public string NomAgence { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double EncourAdhesion { get; set; } 
		public int AgenceId { get; set; } 
		public string UtilisateurLogin { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Assistance : BaseEntity
    {
        public int MembreId { get; set; }
        public double Montant { get; set; }
        public string MotifAssistance { get; set; } = string.Empty;
        public string DateAssistance { get; set; } = string.Empty;

        public Membre? Membre { get; set; }
        public Mouvement? Mouvement { get; set; }
		
		public string Nom => Membre?.Nom ?? "";
		public string NomSexe => Membre?.NomSexe ?? "";
		public string Photo => Membre?.Photo ?? "";
		public string NomAgence => Membre?.NomAgence ?? "";
		public int AgenceId => Membre?.AgenceId ?? 0;
        public int AssistanceId => Id;
        public string Status => Mouvement is null ? "Non payée" : "Payée";
        public double EncourAssistance => Mouvement is null ? 0 : Montant;
		
		[ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }
		
		public string UtilisateurLogin => Utilisateur?.Login ?? "";
    }
}
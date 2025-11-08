using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Echeance : BaseEntity
    {
        public string DateEcheance { get; set; } = string.Empty;
        public double MontantCapital { get; set; }
        public double MontantCommission { get; set; }
        public double MontantInterets { get; set; }

        public int? CreditId { get; set; }
		public Credit? Credit { get; set; }
        public int? AvanceId { get; set; }
		public Avance? Avance { get; set; }
		
        public string? DatePaiement { get; set; } 
        public string? DateAnticipation { get; set; }

        public List<Mouvement>? Mouvements { get; set; }
        public string Status => (DateAnticipation != null) && (MontantCapitalRestant != 0) ? "Anticipée": Mouvements is null || !Mouvements.Any(m => m.MontantCredit == MontantTotal) ? "Non payée" : "Payée";
        public double MontantTotal => MontantCapital + MontantCommission + MontantInterets;
        public double MontantCapitalRestant => MontantCapital - ((Mouvements?.Sum(m => m.MontantCredit) ?? 0)- MontantInterets- MontantCommission);
        public string Nom => Avance?.Nom ?? Credit?.Nom ?? "";
        public string NomSexe => Avance?.NomSexe ?? Credit?.NomSexe ?? "";
        public string Photo => Avance?.Photo ?? Credit?.Photo ?? "";
        public string NomAgence => Avance?.NomAgence ?? Credit?.NomAgence ?? "";
        public int AgenceId => Avance?.AgenceId ?? Credit?.AgenceId ?? 0;
        public int MembreId => Avance?.MembreId ?? Credit?.MembreId ?? 0;
        public int EcheanceId => Id;

        [ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }

        public string UtilisateurLogin => Utilisateur?.Login ?? "";
    }
}
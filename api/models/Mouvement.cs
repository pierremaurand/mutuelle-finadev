using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Mouvement : BaseEntity
    {
        public string DateMouvement { get; set; } = string.Empty;
        public string Libelle { get; set; } = string.Empty;
        public double MontantDebit { get; set; } = 0;
        public double MontantCredit { get; set; } = 0;
        public int CaisseId { get; set; }

        public double? MontantCapital { get; set; } 
        public double? MontantCommission { get; set; } 
        public double? MontantInterets { get; set; } 
        
        public int? MembreId { get; set; }
        public int? CotisationId { get; set; }
        public int? AdhesionId { get; set; }
        public int? AvanceId { get; set; }
        public int? CreditId { get; set; }
        public int? EcheanceId { get; set; }
        public int? BanqueId { get; set; }

        public Membre? Membre { get; set; }
        public Cotisation? Cotisation { get; set; }
        public Adhesion? Adhesion { get; set; }
        public Avance? Avance { get; set; }
        public Credit? Credit { get; set; }
        public Echeance? Echeance { get; set; }
        public Banque? Banque { get; set; }
        public Caisse? Caisse { get; set; }
		
		[ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }
		
		public string UtilisateurLogin => Utilisateur?.Login ?? "";
    }
}
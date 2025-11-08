using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Credit : BaseEntity
    {
        public int MembreId { get; set; }
        public int Duree { get; set; }
        public double MontantCapital { get; set; }
        public double MontantCommission { get; set; }
        public double MontantInterets { get; set; }
        public string DateDemande { get; set; } = string.Empty;
        public string DateDecaissement { get; set; } = string.Empty;

        public List<Echeance> Echeances { get; set; } = [];
        public List<Mouvement>? Mouvements { get; set; }
        public Membre? Membre { get; set; }


        public double MontantTotal => MontantCapital + MontantCommission + MontantInterets;
        public int NombreEcheancePaye => Echeances?.Count(e => e.MontantCapitalRestant == 0)??0;
		public int NombreEcheanceImpaye => Echeances?.Count(e => e.MontantCapitalRestant > 0)??Duree;
		public string DateDerniereEcheance => Echeances?.Max(e => e.DateEcheance)??"";
        public double MontantCapitalRestant => MontantCapital - Mouvements?.FindAll(x => x.EcheanceId is not null).Sum(m => m.MontantCapital) ?? 0;
        public double MontantCommissionRestant => MontantCommission - Mouvements?.FindAll(x => x.EcheanceId is not null).Sum(m => m.MontantCommission) ?? 0;
        public double MontantInteretsRestant => MontantInterets - Mouvements?.FindAll(x => x.EcheanceId is not null).Sum(m => m.MontantInterets) ?? 0;
        public string Status => NombreEcheanceImpaye == 0 ? "Remboursée" : Mouvements is not null && Mouvements.Count == 0 ? "Validée" : Mouvements is not null && Mouvements.Any(x => x.MontantDebit == MontantCapital) && NombreEcheancePaye == 0 ? "Décaissée" : "En cours";
        public string Nom => Membre?.Nom ?? "";
        public string NomSexe => Membre?.NomSexe ?? "";
        public string Photo => Membre?.Photo ?? "";
        public string NomAgence => Membre?.NomAgence ?? "";
        public int AgenceId  => Membre?.AgenceId ?? 0;
        public int CreditId => Id;

        [ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }
        public string UtilisateurLogin => Utilisateur?.Login ?? "";
    }
}
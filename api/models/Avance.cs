using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Avance : BaseEntity
    {
        public int MembreId { get; set; }
        public int Duree { get; set; }
        public double MontantCapital { get; set; }
        public string DateDemande { get; set; } = string.Empty;
        public string DateDecaissement { get; set; } = string.Empty;

        public List<Echeance> Echeances { get; set; } = new List<Echeance>();
        public List<Mouvement>? Mouvements { get; set; }
        public Membre? Membre { get; set; }
		
		public string Nom => Membre?.Nom ?? "";
		public string NomSexe => Membre?.NomSexe ?? "";
		public string Photo => Membre?.Photo ?? "";
		public string NomAgence => Membre?.NomAgence ?? "";
		public int AgenceId => Membre?.AgenceId ?? 0;
		public int AvanceId => Id;

        public double MontantTotal => MontantCapital;
		public int NombreEcheancePaye => Echeances?.Count(e => e.Status.CompareTo("Payée")==0)??0;
		public int NombreEcheanceImpaye => Echeances?.Count(e => e.Status.CompareTo("Payée")!=0)??Duree;
		public string DateDerniereEcheance => Echeances?.Max(e => e.DateEcheance)??"";
        public double MontantCapitalRestant => Echeances?.Sum(m => m.MontantCapitalRestant) ?? 0;
        public string Status => NombreEcheanceImpaye == 0 ? "Remboursée" : Mouvements is not null && Mouvements.Count == 0 ? "Validée" : Mouvements is not null && Mouvements.Any(x => x.MontantDebit == MontantCapital) && NombreEcheancePaye == 0 ? "Décaissée" : "En cours";

		[ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }
		
		public string UtilisateurLogin => Utilisateur?.Login ?? "";
     
    }
}
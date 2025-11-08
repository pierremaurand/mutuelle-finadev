using mutuelleApi.enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Membre : BaseEntity
    {
        public string Nom { get; set; } = string.Empty;
        public Sexe Sexe { get; set; }
        public string DateNaissance { get; set; } = string.Empty;
        public string LieuNaissance { get; set; } = string.Empty;
        public int AgenceId { get; set; }
        public Agence? Agence { get; set; } // Navigation property
        public string DateAdhesion { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public List<Mouvement>? Mouvements { get; set; }
        public string Photo { get; set; } = string.Empty;
        public bool EstActif { get; set; } = true;

        public double EncourAdhesion => Mouvements?.Where(x => x.AdhesionId is not null).Sum(x => x.MontantCredit - x.MontantDebit)??0;
        public double EncourCotisation => Mouvements?.Where(x => x.CotisationId is not null).Sum(x => x.MontantCredit - x.MontantDebit)??0;
        public double EncourAvance => Mouvements?.Where(x => x.AvanceId is not null).Sum(x => x.MontantDebit - x.MontantCredit)??0;
        public double Decaissements => Mouvements?.Where(x => x.CreditId is not null && x.EcheanceId is null).Sum(x => x.MontantDebit) ?? 0;
        public double Remboursements => Mouvements?.Where(x => x.CreditId is not null && x.EcheanceId is not null).Sum(x => x.MontantCapital) ?? 0;
        public double EncourCredit => Decaissements - Remboursements;
        public double Solde => EncourCotisation - EncourAvance - EncourCredit;

        public void Encaisser(int modificateur)
        {

        }

        public void Decaisser(int modification)
        {

        }

        public void Solder(int modificateur)
        {
            
        }

        public string NomAgence => Agence?.Nom??"";
		
		public string NomSexe => Sexe == Sexe.Masculin ? "Homme":"Femme";

        public int MembreId => Id;
		
		[ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }
		
		public string UtilisateurLogin => Utilisateur?.Login ?? "";
        
    }
}
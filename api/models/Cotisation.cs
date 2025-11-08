using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Cotisation : BaseEntity
    {
        public int MembreId { get; set; }
        public string DateCotisation { get; set; } = string.Empty;
        public double Salaire { get; set; } = 0;
        public double Retenue => Math.Round(Salaire * 0.05);

        public Membre? Membre { get; set; }
        public Mouvement? Mouvement { get; set; }
        public string Status => Mouvement is null ? "Non payée" : "Payée";
        public string Nom => Membre?.Nom ?? "";
        public string NomSexe => Membre?.NomSexe ?? "";
        public string Photo => Membre?.Photo ?? "";
        public string NomAgence => Membre?.NomAgence ?? "";
        public int AgenceId => Membre?.AgenceId ?? 0;
        public int CotisationId => Id;
        public double EncourCotisation => Mouvement is null ? 0 : Retenue;

        [ForeignKey("ModifiePar")]
		public Utilisateur? Utilisateur { get; set; }

        public string UtilisateurLogin => Utilisateur?.Login ?? "";
    }
}
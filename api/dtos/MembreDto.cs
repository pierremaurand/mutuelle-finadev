using mutuelleApi.enums;

namespace mutuelleApi.dtos
{
    public class MembreDto
    {
        public int Id { get; set; }
        public int MembreId { get; set; }
        public string Nom { get; set; } = string.Empty;
		public Sexe Sexe { get; set; }
        public string NomSexe { get; set; } = string.Empty;
        public string DateNaissance { get; set; } = string.Empty;
        public string LieuNaissance { get; set; } = string.Empty;
        public int AgenceId { get; set; }
        public string DateAdhesion { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string NomAgence { get; set; } = string.Empty; 
        public string Photo { get; set; } = string.Empty;
        public bool EstActif { get; set; } = true;
		public double MontantCotise { get; set; } = 0;
		public double Solde { get; set; } = 0;
        public string UtilisateurLogin { get; set; } = string.Empty;
        public double EncourAdhesion { get; set;  }
        public double EncourCotisation { get; set;  }
        public double EncourAvance { get; set;  }
        public double EncourCredit { get; set;  }
    }
}
namespace mutuelleApi.dtos
{
    public class CreditDto
    {
        public int Id { get; set; }
        public int CreditId { get; set; }
        public int Duree { get; set; }
        public double MontantCapital { get; set; }
        public double MontantCommission { get; set; }
        public double MontantInterets { get; set; }
        public string DateDemande { get; set; } = string.Empty;
        public string DateDecaissement { get; set; } = string.Empty;
        public double MontantTotal { get; set; } = 0;
        public double MontantCapitalRestant { get; set; } = 0;
        public double MontantCommissionRestant { get; set; } = 0;
        public double MontantInteretsRestant { get; set; } = 0;
		
        public string Status { get; set; }  = string.Empty;
		public string Nom { get; set; } = string.Empty;
		public string NomSexe { get; set; } = string.Empty;
		public string Photo { get; set; } = string.Empty;
        public string NomAgence { get; set; } = string.Empty;
		public string UtilisateurLogin { get; set; } = string.Empty;
		
		public int AgenceId { get; set; } 
		public int MembreId { get; set; }
		public int NombreEcheancePaye { get; set; }
		public int NombreEcheanceImpaye { get; set; }
		public string DateDerniereEcheance { get; set; } = string.Empty;
    }
}
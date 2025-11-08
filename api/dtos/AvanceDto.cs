namespace mutuelleApi.dtos
{
    public class AvanceDto
    {
        public int Id { get; set; }
        public int AvanceId { get; set; }
        public int Duree { get; set; }
        public double MontantCapital { get; set; }
        public string DateDemande { get; set; } = string.Empty;
        public string DateDecaissement { get; set; } = string.Empty;
        public double MontantTotal { get; set; } = 0;
        public double MontantCapitalRestant { get; set; } = 0;
        public string Status { get; set; }  = string.Empty;
		
		public string Nom { get; set; } = string.Empty;
		public string NomSexe { get; set; } = string.Empty;
		public string Photo{ get; set; } = string.Empty;
        public string NomAgence { get; set; } = string.Empty;
		public string UtilisateurLogin { get; set; } = string.Empty;
		public int AgenceId { get; set; } 
		
		public int MembreId { get; set; }
		
		public int NombreEcheancePaye { get; set; }
		
		public int NombreEcheanceImpaye { get; set; }
		
		public string DateDerniereEcheance { get; set; } = string.Empty;
    }
}
namespace mutuelleApi.dtos
{
    public class EcheanceDto
    {
        public int Id { get; set; }
        public int EcheanceId { get; set; }
        public string DateEcheance { get; set; } = string.Empty;
        public double MontantCapital { get; set; }
        public double MontantCommission { get; set; } = 0;
        public double MontantInterets { get; set; } = 0;


        public double MontantTotal { get; set; } = 0;
        public double MontantCapitalRestant { get; set; } = 0;
        public string Status { get; set; }  = string.Empty;
        public string? DateAnticipation { get; set; } 
        public string? DatePaiement { get; set; } 

        public int CreditId { get; set; } = 0;
        public int AvanceId { get; set; } = 0;
        public int MembreId { get; set; } = 0;
		
		public string Nom { get; set; } = string.Empty;
		public string NomSexe { get; set; } = string.Empty;
		public string Photo { get; set; } = string.Empty;
		public string NomAgence { get; set; } = string.Empty;
		public string UtilisateurLogin { get; set; } = string.Empty;
       
    }
}
namespace mutuelleApi.dtos
{
    public class MouvementDto
    {
        public int Id { get; set; }
        public string DateMouvement { get; set; } = string.Empty;
        public string Libelle { get; set; } = string.Empty;
        public float MontantDebit { get; set; }
        public float MontantCredit { get; set; }
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
		public string UtilisateurLogin { get; set; } = string.Empty;
    }
}
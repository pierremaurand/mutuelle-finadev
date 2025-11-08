namespace mutuelleApi.dtos
{
    public class BanqueDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public double TotalDebit { get; set; } = 0;
        public double TotalCredit { get; set; } = 0;
        public double Solde { get; set; } = 0;
        public string UtilisateurLogin { get; } = string.Empty;
    }
}
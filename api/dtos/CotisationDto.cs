namespace mutuelleApi.dtos
{
    public class CotisationDto
    {
        public int Id { get; set; }
        public int CotisationId { get; set; }
        public int MembreId { get; set; }
        public string DateCotisation { get; set; } = string.Empty;
        public double Retenue { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string NomSexe { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;
        public string NomAgence { get; set; } = string.Empty;
        public int AgenceId { get; set; }
        public string Status { get; set; } = string.Empty;
        public double EncourCotisation { get; set; }
    }
}
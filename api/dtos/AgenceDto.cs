namespace mutuelleApi.dtos
{
    public class AgenceDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public int MembresActifs { get; set; }
    }
}
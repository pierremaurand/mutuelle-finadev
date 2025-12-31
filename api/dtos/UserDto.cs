using mutuelleApi.enums;

namespace mutuelleApi.dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Sexe { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;
    }
}

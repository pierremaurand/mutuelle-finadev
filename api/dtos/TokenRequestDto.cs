using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace mutuelleApi.dtos
{
    public class TokenRequestDto
    {
        [Required(ErrorMessage = "Le login obligatoire!")]
        public string Login { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le token obligatoire!")]
        public string Token { get; set; } = string.Empty;
        [Required(ErrorMessage = "Le refresh-token obligatoire!")]
        public string RefreshToken { get;  set;} = string.Empty;
    }
}
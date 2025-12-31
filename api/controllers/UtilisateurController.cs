using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace mutuelleApi.controllers
{
    public class UtilisateurController(IMapper mapper, IUnitOfWork uow, IConfiguration configuration) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;
        private readonly IConfiguration configuration = configuration;

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginUserRequestDto request)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByLoginAsync(request.Login);

            if (utilisateur is null)
            {
                return NotFound("Utilisateur non trouvé!");
            }

            if (
                utilisateur.MotDePasse is not null &&
                utilisateur.ClesMotDePasse is not null && 
                utilisateur.Status.Equals("true") && 
                !MatchPasswordHash(request.Password, utilisateur.MotDePasse, utilisateur.ClesMotDePasse)
            )
            {
                return BadRequest("Le mot de passe est invalide");
            }

            LoginUserResponseDto response = new LoginUserResponseDto();
            response.Token = CreateJWT(utilisateur, 1);

            await uow.SaveAsync();

            return Ok(response);

        }

        [HttpGet("checkToken")]
        public IActionResult CheckToken()
        {
            return Ok();
        }

        [HttpPost("addNewUser")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddNewUser(AddUserRequestDto request)
        {

            byte[] passwordHash, passwordKey;

            using(var hmac = new HMACSHA512()){
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("mutuelle"));
            }

            var utilisateur = mapper.Map<Utilisateur>(request);
            utilisateur.MotDePasse = passwordHash;
            utilisateur.ClesMotDePasse = passwordKey;
            utilisateur.Status = "true";
            utilisateur.Role = "user";
            utilisateur.ModifiePar = GetUserId();
            utilisateur.ModifieLe = DateTime.Now;
            uow.UtilisateurRepository.Add(utilisateur);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("udpateInfos/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateInfos(int id, UpdateUserRequestDto request)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null)
            {
                return NotFound("Cet utilisateur n'existe pas!");
            }

            utilisateur.Nom = request.Nom;
            utilisateur.Sexe = request.Sexe;
            utilisateur.Role = request.Role;

            utilisateur.ModifiePar = GetUserId();
            utilisateur.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("changeUserStatus/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ChangeUserStatus(int id, UpdateUserStatusRequest request)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null)
            {
                return NotFound("Cet utilisateur n'existe pas!");
            }

            utilisateur.Status = request.Status;
            utilisateur.ModifiePar = GetUserId();
            utilisateur.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("changeUserPassword/{id}")]
        public async Task<IActionResult> ChangeUserPassword(int id, ChangeUserPasswordRequestDto request)
        {
            if(id != GetUserId())
            {
                return Unauthorized("Vous n'êtes pas authorisé à faire cet action.");
            }

            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null)
            {
                return NotFound("Cet utilisateur n'existe pas!");
            }

            if (
                utilisateur.MotDePasse is not null &&
                utilisateur.ClesMotDePasse is not null &&
                !MatchPasswordHash(request.OldPassword, utilisateur.MotDePasse, utilisateur.ClesMotDePasse)
            )
            {
                return BadRequest("L'ancien mot de passe est invalide");
            }

            byte[] passwordHash, passwordKey;

            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.NewPassword));
            }

            utilisateur.MotDePasse = passwordKey;
            utilisateur.ClesMotDePasse = passwordKey;
            utilisateur.ModifiePar = GetUserId();
            utilisateur.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return Ok();
        }


        [HttpGet("getAllUsers")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var utilisateurs = await uow.UtilisateurRepository.GetAllAsync();
            if (utilisateurs is null)
            {
                return NotFound("Aucune utilisateur n'a été trouvé dans la bdd");
            }
            var utilisateursDto = mapper.Map<List<UserDto>>(utilisateurs);
            return Ok(utilisateursDto);
        }

        [HttpGet("getUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null) {
                return NotFound("Utilisateur non trouvé!");
            }
            var userDto = mapper.Map<UserDto>(utilisateur);
            return Ok(userDto);
        }

        private string CreateJWT(Utilisateur utilisateur, int expiration)
        {
            var secretKey = configuration.GetSection("AppSettings:Key").Value;

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("La clé secrète pour le JWT est introuvable ou vide.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new List<Claim>();

            if (!string.IsNullOrEmpty(utilisateur.Login))
            {
                claims.Add(new Claim(ClaimTypes.Name, utilisateur.Login));
            }

            claims.Add(new Claim(ClaimTypes.NameIdentifier, utilisateur.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.Role, utilisateur.Role));

            var signingCredentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256Signature
            );

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(expiration),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool MatchPasswordHash(string passworText, byte[] password, byte[] passwordKey)
        {
            using (var hmac = new HMACSHA512(passwordKey))
            {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passworText));

                for (int i = 0; i < passwordHash.Length; i++)
                {
                    if (password[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }
    }
}
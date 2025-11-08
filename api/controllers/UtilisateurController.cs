using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class UtilisateurController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(UtilisateurRequestDto request)
        {
            byte[] passwordHash, passwordKey;

            using(var hmac = new HMACSHA512()){
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("mutuelle"));
            }

            var utilisateur = mapper.Map<Utilisateur>(request);
            utilisateur.MotDePasse = passwordHash;
            utilisateur.ClesMotDePasse = passwordKey;
            utilisateur.EstActif = true;
            utilisateur.ModifiePar = GetUserId();
            utilisateur.ModifieLe = DateTime.Now;
            uow.UtilisateurRepository.Add(utilisateur);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPut("activate/{id}")]
        public async Task<IActionResult> Activate(int id, UpdateUtilisateurActifRequestDto request)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null)
            {
                return NotFound("Cet utilisateur n'existe pas!");
            }
            mapper.Map(request, utilisateur);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UtilisateurRequestDto request)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null)
            {
                return NotFound("Cet utilisateur n'existe pas!");
            }

            mapper.Map(request, utilisateur);
            utilisateur.ModifiePar = GetUserId();
            utilisateur.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var utilisateurs = await uow.UtilisateurRepository.GetAllAsync();
            if (utilisateurs is null)
            {
                return NotFound("Aucune utilisateur n'a été trouvé dans la bdd");
            }
            var utilisateursDto = mapper.Map<List<UtilisateurDto>>(utilisateurs);
            return Ok(utilisateursDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var utilisateur = await uow.UtilisateurRepository.GetByIdAsync(id);
            if (utilisateur is null) {
                return NotFound("Utilisateur non trouvé!");
            }
            var utilisateurDto = mapper.Map<UtilisateurDto>(utilisateur);
            return Ok(utilisateurDto);
        }
    }
}
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class MouvementController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;
		
        [HttpPost]
        public async Task<IActionResult> Add(MouvementRequestDto request)
        {
            var caisse = await uow.CaisseRepository.GetByIdAsync(request.CaisseId);
            if (caisse is null)
            {
                return NotFound("Caisse non trouvée");
            }

            var mouvement = mapper.Map<Mouvement>(request); 
		
            mouvement.ModifiePar = GetUserId();
            mouvement.ModifieLe = DateTime.Now;

            if (caisse.Mouvements is null)
            {
                caisse.Mouvements = [];
            }

            caisse.Mouvements.Add(mouvement);
			
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpPost("add-all")]
        public async Task<IActionResult> AddAll(List<MouvementRequestDto> request)
        {
            foreach (var mouvementRequest in request)
            {
                var caisse = await uow.CaisseRepository.GetByIdAsync(mouvementRequest.CaisseId);
                if (caisse is null)
                {
                    return NotFound("Caisse non trouvée");
                }

                var mouvement = mapper.Map<Mouvement>(mouvementRequest);

                mouvement.ModifiePar = GetUserId();
                mouvement.ModifieLe = DateTime.Now;

                if (caisse.Mouvements is null)
                {
                    caisse.Mouvements = [];
                }

                caisse.Mouvements.Add(mouvement);
            }
			
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var mouvements = await uow.MouvementRepository.GetAllAsync();
            if (mouvements is null)
            {
                return NotFound("Mouvements non trouvés");
            }
            var mouvementsDto = mapper.Map<List<MouvementDto>>(mouvements);
            return Ok(mouvementsDto);
        }
		
		[HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var mouvement = await uow.MouvementRepository.GetByIdAsync(id);
            if(mouvement is null) {
                return NotFound("Mouvement non trouvé");
            }
            var mouvementDto = mapper.Map<MouvementDto>(mouvement);
            return Ok(mouvementDto);
        }
		
    }
}
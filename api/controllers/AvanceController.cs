using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class AvanceController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

		[HttpPut("anticipation/{id}")]
        public async Task<IActionResult> Anticipation(int id,List<RemboursementEcheanceDto> request)
        {
			var avance = await uow.AvanceRepository.GetByIdAsync(id);
			
			if(avance is null) {
				return NotFound("Avance non trouvée");
			}
			
            if (avance.Membre is null)
            {
                return NotFound("Membre non trouvé");
            }

            if(avance.Echeances is null) {
                return BadRequest("Avance sans echeancier");
            }
			
			foreach(var echeanceRequest in request) {
				var echeance = avance.Echeances.Find(x => x.Id == echeanceRequest.Id); 
				if(echeance is null) {
					return NotFound("Echance non trouvée");
				}
				echeance.DateAnticipation = echeanceRequest.DatePaiement;
				echeance.ModifiePar = GetUserId();
                echeance.ModifieLe = DateTime.Now;
			}

            await uow.SaveAsync();
            return StatusCode(201);
        }
		
        [HttpPost]
        public async Task<IActionResult> Add(AvanceRequestDto request)
        {
            var membre = await uow.MembreRepository.GetByIdAsync(request.MembreId);
            if (membre is null)
            {
                return NotFound("Membre non trouvé");
            }
            var avance = mapper.Map<Avance>(request);
			
			foreach (var echeance in avance.Echeances)
            {
                echeance.ModifiePar = GetUserId();
                echeance.ModifieLe = DateTime.Now;
            } 
			
			avance.Membre = membre;
            avance.ModifiePar = GetUserId();
            avance.ModifieLe = DateTime.Now;
            uow.AvanceRepository.Add(avance);
			
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.AvanceRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AvanceRequestDto request)
        {
            var avance = await uow.AvanceRepository.GetByIdAsync(id);
			if(avance is null) {
				return NotFound("Avance non trouvée");
			}
			
			mapper.Map(request, avance);
            avance.ModifiePar = GetUserId();
            avance.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var avances = await uow.AvanceRepository.GetAllAsync();
            if (avances is null)
            {
                return NotFound("Avances non trouvées");
            }
            var avancesDto = mapper.Map<List<AvanceDto>>(avances);
            return Ok(avancesDto);
        }
		
		[HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var avance = await uow.AvanceRepository.GetByIdAsync(id);
            if(avance is null) {
                return NotFound("Avance non trouvée");
            }
            var avanceDto = mapper.Map<AvanceDto>(avance);
            return Ok(avanceDto);
        }
		
		[HttpPost("echeance")]
        public async Task<IActionResult> AddEcheances(List<EcheanceAvanceRequestDto> request)
        {
            var echeances = mapper.Map<List<Echeance>>(request);
            foreach (var echeance in echeances)
            {
                echeance.ModifiePar = GetUserId();
                echeance.ModifieLe = DateTime.Now;
                uow.EcheanceRepository.Add(echeance);
            }

            await uow.SaveAsync();
            return StatusCode(201);
        }
		
    }
}
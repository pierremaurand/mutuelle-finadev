using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;

namespace mutuelleApi.controllers
{
    public class EcheanceController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var echeances = await uow.EcheanceRepository.GetAllAsync();
            if (echeances is null)
            {
                return NotFound("Echéances non trouvées");
            }
            var echeancesDto = mapper.Map<List<EcheanceDto>>(echeances);
            return Ok(echeancesDto);
        }
		
		[HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var echeance = await uow.EcheanceRepository.GetByIdAsync(id);
            if(echeance is null) {
                return NotFound("Echéance non trouvée");
            }
            var echeanceDto = mapper.Map<EcheanceDto>(echeance);
            return Ok(echeanceDto);
        }

        [HttpPut]
        public async Task<IActionResult> Put(List<RemboursementEcheanceDto> request) 
        {
            foreach(var echeanceRequest in request) {
				var echeance = await uow.EcheanceRepository.GetByIdAsync(echeanceRequest.Id); 
				if(echeance is null) {
					return NotFound("Echance non trouvée");
				}

				echeance.DatePaiement = echeanceRequest.DatePaiement;
				echeance.ModifiePar = GetUserId();
                echeance.ModifieLe = DateTime.Now;
			}

            await uow.SaveAsync();
            return StatusCode(201);
        }
    }
}
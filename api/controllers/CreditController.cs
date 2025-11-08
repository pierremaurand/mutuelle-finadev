using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class CreditController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

		[HttpPut("anticipation/{id}")]
        public async Task<IActionResult> Anticipation(int id,List<RemboursementEcheanceDto> request)
        {
			var credit = await uow.CreditRepository.GetByIdAsync(id);
			
			if(credit is null) {
				return NotFound("Credit non trouvée");
			}
			
            if (credit.Membre is null)
            {
                return NotFound("Membre non trouvé");
            }

            if(credit.Echeances is null) {
                return BadRequest("Credit sans echeancier");
            }
			
			foreach(var echeanceRequest in request) {
				var echeance = credit.Echeances.Find(x => x.Id == echeanceRequest.Id); 
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
        public async Task<IActionResult> Add(CreditRequestDto request)
        {
            var membre = await uow.MembreRepository.GetByIdAsync(request.MembreId);
            if (membre is null)
            {
                return NotFound("Membre non trouvé");
            }
            var credit = mapper.Map<Credit>(request);
			
			foreach (var echeance in credit.Echeances)
            {
                echeance.ModifiePar = GetUserId();
                echeance.ModifieLe = DateTime.Now;
            } 
			
			credit.Membre = membre;
            credit.ModifiePar = GetUserId();
            credit.ModifieLe = DateTime.Now;
            uow.CreditRepository.Add(credit);
			
            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.CreditRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreditRequestDto request)
        {
            var credit = await uow.CreditRepository.GetByIdAsync(id);
			if(credit is null) {
				return NotFound("Credit non trouvée");
			}
			
			mapper.Map(request, credit);
            credit.ModifiePar = GetUserId();
            credit.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var credits = await uow.CreditRepository.GetAllAsync();
            if (credits is null)
            {
                return NotFound("Credits non trouvées");
            }
            var creditsDto = mapper.Map<List<CreditDto>>(credits);
            return Ok(creditsDto);
        }
		
		[HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var credit = await uow.CreditRepository.GetByIdAsync(id);
            if(credit is null) {
                return NotFound("Credit non trouvée");
            }
            var creditDto = mapper.Map<CreditDto>(credit);
            return Ok(creditDto);
        }
		
		[HttpPost("echeance")]
        public async Task<IActionResult> AddEcheances(List<EcheanceCreditRequestDto> request)
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
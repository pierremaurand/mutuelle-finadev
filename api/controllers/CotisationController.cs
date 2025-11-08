using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class CotisationController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(List<CotisationRequestDto> request)
        {
            var cotisations = mapper.Map<List<Cotisation>>(request);
            foreach (var cotisation in cotisations)
            {
				var membre = await uow.MembreRepository.GetByIdAsync(cotisation.MembreId);
				if(membre is null) {
					return NotFound("Membre non trouvé");
				}
				cotisation.Membre = membre;
                cotisation.ModifiePar = GetUserId();
                cotisation.ModifieLe = DateTime.Now;
                uow.CotisationRepository.Add(cotisation);
            }

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.CotisationRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CotisationRequestDto request)
        {
            var cotisation = await uow.CotisationRepository.GetByIdAsync(id);
            if (cotisation is null)
            {
                return NotFound("Cotisation non trouvée!");
            }
            mapper.Map(request, cotisation);
            cotisation.ModifiePar = GetUserId();
            cotisation.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var cotisations = await uow.CotisationRepository.GetAllAsync();
            if (cotisations is null)
            {
                return NotFound("Cotisations non trouvées");
            }
            var cotisationsDto = mapper.Map<List<CotisationDto>>(cotisations);
            return Ok(cotisationsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var cotisation = await uow.CotisationRepository.GetByIdAsync(id);
            if(cotisation is null) {
                return NotFound("Cotisation non trouvée!");
            }
            var cotisationDto = mapper.Map<CotisationDto>(cotisation);
            return Ok(cotisationDto);
        }
        
    }
}
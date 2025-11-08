using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class AdhesionController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(List<AdhesionRequestDto> request)
        {
			
            var adhesions = mapper.Map<List<Adhesion>>(request);
            foreach (var adhesion in adhesions)
            {
				var membre = await uow.MembreRepository.GetByIdAsync(adhesion.MembreId);
				if(membre is null) {
					return NotFound("Membre non trouvé");
				}
				
				adhesion.Membre = membre;
                adhesion.ModifiePar = GetUserId();
                adhesion.ModifieLe = DateTime.Now;
                uow.AdhesionRepository.Add(adhesion);
				
            }

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.AdhesionRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AdhesionRequestDto request)
        {
            var adhesion = await uow.AdhesionRepository.GetByIdAsync(id);
            if (adhesion is null)
            {
                return NotFound("Adhesion non trouvée!");
            }
            mapper.Map(request, adhesion);
            adhesion.ModifiePar = GetUserId();
            adhesion.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var adhesions = await uow.AdhesionRepository.GetAllAsync();
            if (adhesions is null)
            {
                return NotFound("Adhesions non trouvées!");
            }
            var adhesionsDto = mapper.Map<List<AdhesionDto>>(adhesions);
            return Ok(adhesionsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var adhesion = await uow.AdhesionRepository.GetByIdAsync(id);
            if(adhesion is null) {
                return NotFound("Adhesion non trouvée!");
            }
            var adhesionDto = mapper.Map<AdhesionDto>(adhesion);
            return Ok(adhesionDto);
        }
        
    }
}
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class AgenceController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(AgenceRequestDto request)
        {
            var agence = mapper.Map<Agence>(request);
            agence.ModifiePar = GetUserId();
            agence.ModifieLe = DateTime.Now;
            uow.AgenceRepository.Add(agence);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.AgenceRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AgenceRequestDto request)
        {
            var agence = await uow.AgenceRepository.GetByIdAsync(id);
            if (agence is null)
            {
                return NotFound("Agence non trouvée!");
            }
            mapper.Map(request, agence);
            agence.ModifiePar = GetUserId();
            agence.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var agences = await uow.AgenceRepository.GetAllAsync();
            if(agences is null) {
                return NotFound("Agences non trouvées!");
            }
            var agencesDto = mapper.Map<List<AgenceDto>>(agences);
            return Ok(agencesDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var agence = await uow.AgenceRepository.GetByIdAsync(id);
            if(agence is null) {
                return NotFound("Agence non trouvée!");
            }
            var agenceDto = mapper.Map<AgenceDto>(agence);
            return Ok(agenceDto);
        }
    }
}
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class MembreController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(MembreRequestDto request)
        {
            var membre = mapper.Map<Membre>(request);
            membre.ModifiePar = GetUserId();
            membre.ModifieLe = DateTime.Now;
            uow.MembreRepository.Add(membre);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.MembreRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MembreRequestDto request)
        {
            var membre = await uow.MembreRepository.GetByIdAsync(id);
            if (membre is null)
            {
                return NotFound("Membre non trouvé!");
            }
            mapper.Map(request, membre);
            membre.ModifiePar = GetUserId();
            membre.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var membres = await uow.MembreRepository.GetAllAsync();
            if (membres is null)
            {
                return NotFound("Aucune membre n'a été trouvé dans la bdd");
            }
            var membresDto = mapper.Map<List<MembreDto>>(membres);
            return Ok(membresDto);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var membre = await uow.MembreRepository.GetByIdAsync(id);
            if (membre is null) {
                return NotFound("Membre non trouvé!");
            }
            var membreDto = mapper.Map<MembreDto>(membre);
            return Ok(membreDto);
        }
       
    }
}
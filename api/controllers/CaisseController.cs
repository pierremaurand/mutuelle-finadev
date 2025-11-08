using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class CaisseController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(CaisseRequestDto request)
        {
            var caisse = mapper.Map<Caisse>(request);
            caisse.ModifiePar = GetUserId();
            caisse.ModifieLe = DateTime.Now;
            uow.CaisseRepository.Add(caisse);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.CaisseRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CaisseRequestDto request)
        {
            var caisse = await uow.CaisseRepository.GetByIdAsync(id);
            if (caisse is null)
            {
                return NotFound("Caisse non trouvée!");
            }
            mapper.Map(request, caisse);
            caisse.ModifiePar = GetUserId();
            caisse.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var caisses = await uow.CaisseRepository.GetAllAsync();
            if (caisses is null)
            {
                return NotFound("Caisses non trouvées!");
            }
            var caissesDto = mapper.Map<List<CaisseDto>>(caisses);
            return Ok(caissesDto);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var caisse = await uow.CaisseRepository.GetByIdAsync(id);
            if (caisse is null)
            {
                return NotFound("Caisse non trouvée!");
            }
            var caisseDto = mapper.Map<CaisseDto>(caisse);
            return Ok(caisseDto);
        }
    }
}
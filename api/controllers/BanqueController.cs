using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class BanqueController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(BanqueRequestDto request)
        {
            var banque = mapper.Map<Banque>(request);
            banque.ModifiePar = GetUserId();
            banque.ModifieLe = DateTime.Now;
            uow.BanqueRepository.Add(banque);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.BanqueRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BanqueRequestDto request)
        {
            var banque = await uow.BanqueRepository.GetByIdAsync(id);
            if (banque is null)
            {
                return NotFound("Banque non trouvée!");
            }
            mapper.Map(request, banque);
            banque.ModifiePar = GetUserId();
            banque.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var banques = await uow.BanqueRepository.GetAllAsync();
            if(banques is null) {
                return NotFound("Banques non trouvées!");
            }
            var banquesDto = mapper.Map<List<BanqueDto>>(banques);
            return Ok(banquesDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var banque = await uow.BanqueRepository.GetByIdAsync(id);
            if(banque is null) {
                return NotFound("Banque non trouvée!");
            }
            var banqueDto = mapper.Map<BanqueDto>(banque);
            return Ok(banqueDto);
        }
    }
}
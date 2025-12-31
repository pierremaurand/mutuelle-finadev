using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mutuelleApi.dtos;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.controllers
{
    public class AssistanceController(IMapper mapper, IUnitOfWork uow) : BaseController
    {
        private readonly IUnitOfWork uow = uow;
        private readonly IMapper mapper = mapper;

        [HttpPost]
        public async Task<IActionResult> Add(AssistanceRequestDto request)
        {
            var assistance = mapper.Map<Assistance>(request);
            assistance.ModifiePar = GetUserId();
            assistance.ModifieLe = DateTime.Now;
            uow.AssistanceRepository.Add(assistance);

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.AssistanceRepository.Delete(id);
            await uow.SaveAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AssistanceRequestDto request)
        {
            var assistance = await uow.AssistanceRepository.GetByIdAsync(id);
            if (assistance is null)
            {
                return NotFound("Assistance non trouvée!");
            }
            mapper.Map(request, assistance);
            assistance.ModifiePar = GetUserId();
            assistance.ModifieLe = DateTime.Now;

            await uow.SaveAsync();
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var assistances = await uow.AssistanceRepository.GetAllAsync();
            if(assistances is null) {
                return NotFound("Assistances non trouvées!");
            }
            var assistancesDto = mapper.Map<List<AssistanceDto>>(assistances);
            return Ok(assistancesDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var assistance = await uow.AssistanceRepository.GetByIdAsync(id);
            if(assistance is null) {
                return NotFound("Assistance non trouvée!");
            }
            var assistanceDto = mapper.Map<AssistanceDto>(assistance);
            return Ok(assistanceDto);
        }
    }
}
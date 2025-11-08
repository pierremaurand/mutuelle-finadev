using AutoMapper;
using mutuelleApi.dtos;
using mutuelleApi.models;

namespace mutuelleApi.helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Adhesion, AdhesionDto>().ReverseMap();
            CreateMap<Adhesion, AdhesionRequestDto>().ReverseMap();

            CreateMap<Agence, AgenceDto>().ReverseMap();
            CreateMap<Agence, AgenceRequestDto>().ReverseMap();

            CreateMap<Avance, AvanceDto>().ReverseMap();
            CreateMap<Avance, AvanceRequestDto>().ReverseMap();

            CreateMap<Cotisation, CotisationDto>().ReverseMap();
            CreateMap<Cotisation, CotisationRequestDto>().ReverseMap();

            CreateMap<Credit, CreditDto>().ReverseMap();
            CreateMap<Credit, CreditRequestDto>().ReverseMap();

            CreateMap<Membre, MembreDto>().ReverseMap();
            CreateMap<Membre, MembreRequestDto>().ReverseMap();

            CreateMap<Utilisateur, UtilisateurDto>().ReverseMap();
            CreateMap<Utilisateur, UtilisateurRequestDto>().ReverseMap();

            CreateMap<Echeance, EcheanceAvanceRequestDto>().ReverseMap();
            CreateMap<Echeance, EcheanceCreditRequestDto>().ReverseMap();
            CreateMap<Echeance, EcheanceDto>().ReverseMap();

            CreateMap<Mouvement, MouvementDto>().ReverseMap();
            CreateMap<Mouvement, MouvementRequestDto>().ReverseMap();

            CreateMap<Banque, BanqueDto>().ReverseMap();
            CreateMap<Banque, BanqueRequestDto>().ReverseMap();
            
            CreateMap<Caisse, CaisseDto>().ReverseMap();
            CreateMap<Caisse, CaisseRequestDto>().ReverseMap();
        }
    }
}
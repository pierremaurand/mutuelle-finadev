

namespace mutuelleApi.interfaces
{
    public interface IUnitOfWork
    {
        IAdhesionRepository AdhesionRepository { get; } 
        IAgenceRepository AgenceRepository { get; } 
        IAssistanceRepository AssistanceRepository { get; } 
        IAvanceRepository AvanceRepository { get; }
        IBanqueRepository BanqueRepository { get; }
        ICaisseRepository CaisseRepository { get; }
        ICotisationRepository CotisationRepository { get; }
        ICreditRepository CreditRepository { get; }
        IEcheanceRepository EcheanceRepository { get; }
        IMembreRepository MembreRepository { get; }
        IMouvementRepository MouvementRepository { get; }
        IUtilisateurRepository UtilisateurRepository { get; }

        Task<bool> SaveAsync();
    }
}
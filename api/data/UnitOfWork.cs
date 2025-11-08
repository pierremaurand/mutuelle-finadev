using mutuelleApi.data.repo;
using mutuelleApi.interfaces;

namespace mutuelleApi.data
{
    public class UnitOfWork(DataContext dc) : IUnitOfWork
    {
        private readonly DataContext dc = dc;

        public IAdhesionRepository AdhesionRepository => new AdhesionRepository(dc);
        public IAgenceRepository AgenceRepository => new AgenceRepository(dc);
        public IAvanceRepository AvanceRepository => new AvanceRepository(dc);
        public IBanqueRepository BanqueRepository => new BanqueRepository(dc);
        public ICaisseRepository CaisseRepository => new CaisseRepository(dc);
        public ICotisationRepository CotisationRepository => new CotisationRepository(dc);
        public ICreditRepository CreditRepository => new CreditRepository(dc);
        public IEcheanceRepository EcheanceRepository => new EcheanceRepository(dc);
        public IMembreRepository MembreRepository => new MembreRepository(dc);
        public IMouvementRepository MouvementRepository => new MouvementRepository(dc);
        public IUtilisateurRepository UtilisateurRepository => new UtilisateurRepository(dc);
        public async Task<bool> SaveAsync()
        {
           return await dc.SaveChangesAsync() > 0;
        }
    }
}
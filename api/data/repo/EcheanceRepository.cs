using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class EcheanceRepository(DataContext dc) : IEcheanceRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Echeance echeance)
        {
            if(dc.Echeances is not null && echeance is not null) {
                dc.Echeances.Add(echeance);
            }
        }

        public void Delete(int id)
        {
            if(dc.Echeances is not null) {
				var echeance = dc.Echeances.Find(id);
				if(echeance is not null) {
					dc.Echeances.Remove(echeance);
				}
            }
        }

        public async Task<IEnumerable<Echeance>?> GetAllAsync()
        {
            if(dc.Echeances is not null) {
                var echeances = await dc.Echeances
				.Include(e => e.Avance)
				.ThenInclude(a => a != null ? a.Membre: null)
				.Include(e => e.Credit)
				.ThenInclude(c => c != null ? c.Membre: null)
				.Include(e => e.Mouvements)
				.Include(e => e.Utilisateur)
                .ToListAsync();
                if(echeances is not null) {
                    return echeances;
                }
            }

            return null;
        }
		
		public async Task<Echeance?> GetByIdAsync(int id)
        {
            if(dc.Echeances is not null) {
                var echeance = await dc.Echeances
				.Include(e => e.Avance)
				.ThenInclude(a => a != null ? a.Membre: null)
				.Include(e => e.Credit)
				.ThenInclude(c => c != null ? c.Membre: null)
				.Include(e => e.Mouvements)
				.Include(e => e.Utilisateur)
                .Where(e => e.Id == id)
                .FirstAsync();
                if(echeance is not null) {
                    return echeance;
                }
            }

            return null;
        }
    }
}
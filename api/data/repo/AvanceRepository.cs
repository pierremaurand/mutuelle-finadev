using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class AvanceRepository(DataContext dc) : IAvanceRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Avance avance)
        {
            if(dc.Avances is not null && avance is not null) {
                dc.Avances.Add(avance);
            }
        }

        public void Delete(int id)
        {
            if(dc.Avances is not null) {
				var avance = dc.Avances.Find(id);
				if(avance is not null) {
					dc.Avances.Remove(avance);
				}
			}
        }

        public async Task<IEnumerable<Avance>?> GetAllAsync()
        {
             if(dc.Avances is not null) {
                var avances = await dc.Avances
                .Include(c => c.Membre)
                .Include(c => c.Mouvements)
                .Include(c => c.Echeances)
                .ThenInclude(e => e != null ? e.Mouvements: null)
				.Include(c => c.Utilisateur)
                .ToListAsync();
                if(avances is not null) {
                    return avances;
                }
            }

            return null;
        }
		
		 public async Task<Avance?> GetByIdAsync(int id)
        {
             if(dc.Avances is not null) {
                var avance = await dc.Avances
                .Include(c => c.Membre)
                .Include(c => c.Mouvements)
                .Include(c => c.Echeances)
                .ThenInclude(e => e != null ? e.Mouvements: null)
				.Include(c => c.Utilisateur)
                .Where(c => c.Id == id)
                .FirstAsync();
                if(avance is not null) {
                    return avance;
                }
            }

            return null;
        }
    }
}
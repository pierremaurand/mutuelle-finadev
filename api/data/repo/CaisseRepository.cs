using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class CaisseRepository(DataContext dc) : ICaisseRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Caisse caisse)
        {
            if(dc.Caisses is not null && caisse is not null) {
                dc.Caisses.Add(caisse);
            }
        }

        public void Delete(int id)
        {
            if(dc.Caisses is not null) {
				var caisse = dc.Caisses.Find(id);
				if(caisse is not null) {
					dc.Caisses.Remove(caisse);
				}
			}
        }

        public async Task<IEnumerable<Caisse>?> GetAllAsync()
        {
             if(dc.Caisses is not null) {
                var caisses = await dc.Caisses
                .Include(c => c.Mouvements)
                .Include(c => c.Agent)
				.Include(c => c.Createur)
                .ToListAsync();
                if(caisses is not null) {
                    return caisses;
                }
            }

            return null;
        }
		
		 public async Task<Caisse?> GetByIdAsync(int id)
        {
             if(dc.Caisses is not null) {
                var caisse = await dc.Caisses
				.Include(c => c.Mouvements)
				.Include(c => c.Agent)
				.Include(c => c.Createur)
                .Where(c => c.Id == id)
                .FirstAsync();
                if(caisse is not null) {
                    return caisse;
                }
            }

            return null;
        }
    }
}
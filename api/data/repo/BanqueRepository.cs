using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class BanqueRepository(DataContext dc) : IBanqueRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Banque banque)
        {
            if(dc.Banques is not null && banque is not null) {
                dc.Banques.Add(banque);
            }
        }

        public void Delete(int id)
        {
            if(dc.Banques is not null) {
				var banque = dc.Banques.Find(id);
				if(banque is not null) {
					dc.Banques.Remove(banque);
				}
			}
        }

        public async Task<IEnumerable<Banque>?> GetAllAsync()
        {
             if(dc.Banques is not null) {
                var banques = await dc.Banques
				.Include(c => c.Mouvements)
				.Include(c => c.Utilisateur)
                .ToListAsync();
                if(banques is not null) {
                    return banques;
                }
            }

            return null;
        }
		
		 public async Task<Banque?> GetByIdAsync(int id)
        {
             if(dc.Banques is not null) {
                var banque = await dc.Banques
				.Include(c => c.Mouvements)
				.Include(c => c.Utilisateur)
                .Where(c => c.Id == id)
                .FirstAsync();
                if(banque is not null) {
                    return banque;
                }
            }

            return null;
        }
    }
}
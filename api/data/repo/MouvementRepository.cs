using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class MouvementRepository(DataContext dc) : IMouvementRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Mouvement mouvement)
        {
            if (dc.Mouvements is not null && mouvement is not null)
            {
                dc.Mouvements.Add(mouvement);
            }
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Mouvement>?> GetAllAsync()
        {
            if (dc.Mouvements is not null)
            {
                var mouvements = await dc.Mouvements
				.Include(m => m.Utilisateur)
                .ToListAsync();
                if (mouvements is not null)
                {
                    return mouvements;
                }
            }

            return null;
        }

        public async Task<Mouvement?> GetByIdAsync(int id)
        {
            if(dc.Mouvements is not null) {
                var mouvement = await dc.Mouvements
				.Include(m => m.Utilisateur)
                .Where(x => x.Id == id)
                .FirstAsync();
                if(mouvement is not null) {
                    return mouvement;
                }
            }

            return null;
        }
    }
}
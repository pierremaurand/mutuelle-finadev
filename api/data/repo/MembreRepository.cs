using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class MembreRepository(DataContext dc) : IMembreRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Membre membre)
        {
            if (dc.Membres is not null && membre is not null)
            {
                dc.Membres.Add(membre);
            }
        }


        public void Delete(int id)
        {
            if (dc.Membres is not null)
            {
                var membre = dc.Membres.Find(id);
				if(membre != null) {
					dc.Membres.Remove(membre);
				}
            }
        }

        public async Task<IEnumerable<Membre>?> GetAllAsync()
        {
            if (dc.Membres is not null)
            {
                var membres = await dc.Membres
				.Include(m => m.Agence)
                .Include(m => m.Mouvements)
				.Include(m => m.Utilisateur)
				.OrderBy(m => m.Nom)
                .ToListAsync();
                if (membres is not null)
                {
                    return membres;
                }
            }

            return null;
        }

        public async Task<Membre?> GetByIdAsync(int id)
        {
            if (dc.Membres is not null)
            {
                var membre = await dc.Membres
				.Include(m => m.Agence)
				.Include(m => m.Mouvements)
				.Include(m => m.Utilisateur)
                .Where(s => s.Id == id)
                .FirstAsync();
                if (membre is not null)
                {
                    return membre;
                }
            }

            return null;
        }
    }
}
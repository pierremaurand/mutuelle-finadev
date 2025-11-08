using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class AdhesionRepository(DataContext dc) : IAdhesionRepository
    {
        public readonly DataContext dc = dc;
        
        public void Add(Adhesion adhesion)
        {
            if (dc.Adhesions is not null && adhesion is not null)
            {
                dc.Adhesions.Add(adhesion);
            }
        }

        public void Delete(int id)
        {
            if(dc.Adhesions is not null) {
				var adhesion = dc.Adhesions.Find(id);
				if(adhesion != null) {
					dc.Adhesions.Remove(adhesion);
				}
            }
        }

        public async Task<IEnumerable<Adhesion>?> GetAllAsync()
        {
            if (dc.Adhesions is not null)
            {
                var adhesions = await dc.Adhesions
				.Include(c => c.Membre)
				.Include(c => c.Mouvement)
				.Include(c => c.Utilisateur)
                .ToListAsync();
                if (adhesions is not null)
                {
                    return adhesions;
                }
            }

            return null;
        }

        public async Task<Adhesion?> GetByIdAsync(int id)
        {
            if (dc.Adhesions is not null)
            {
                var adhesion = await dc.Adhesions
				.Include(c => c.Membre)
				.Include(c => c.Mouvement)
				.Include(c => c.Utilisateur)
                .Where(c => c.Id == id)
                .FirstAsync();
                if(adhesion is not null)
                {
                    return adhesion;
                }
            }

            return null;
        }
    }
}
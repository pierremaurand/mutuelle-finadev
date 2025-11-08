using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class AgenceRepository(DataContext dc) : IAgenceRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Agence agence)
        {
            if (dc.Agences is not null && agence is not null)
            {
                dc.Agences.Add(agence);
            }
        }

        public void Delete(int id)
        {
            if (dc.Agences is not null)
            {
				var agence = dc.Agences.Find(id);
				if(agence != null) {
					dc.Agences.Remove(agence);
				}
                
            }
        }

        public async Task<IEnumerable<Agence>?> GetAllAsync()
        {
            if (dc.Agences is not null)
            {
                var agences = await dc.Agences
				.Include(c => c.Membres)
				.Include(c => c.Utilisateur)
                .ToListAsync();
                if (agences is not null)
                {
                    return agences;
                }
            }

            return null;
        }

        public async Task<Agence?> GetByIdAsync(int id)
        {
            if (dc.Agences is not null)
            {
                var agence = await dc.Agences
				.Include(c => c.Membres)
				.Include(c => c.Utilisateur)
                .Where(c => c.Id == id)
                .FirstAsync();
                if(agence is not null)
                {
                    return agence;
                }
            }

            return null;
        }

    }
}
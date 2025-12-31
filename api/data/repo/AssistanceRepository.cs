using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class AssistanceRepository(DataContext dc) : IAssistanceRepository
    {
        public readonly DataContext dc = dc;
        
        public void Add(Assistance assistance)
        {
            if (dc.Assistances is not null && assistance is not null)
            {
                dc.Assistances.Add(assistance);
            }
        }

        public void Delete(int id)
        {
            if(dc.Assistances is not null) {
				var assistance = dc.Assistances.Find(id);
				if(assistance != null) {
					dc.Assistances.Remove(assistance);
				}
            }
        }

        public async Task<IEnumerable<Assistance>?> GetAllAsync()
        {
            if (dc.Assistances is not null)
            {
                var assistances = await dc.Assistances
				.Include(c => c.Membre)
				.Include(c => c.Mouvement)
				.Include(c => c.Utilisateur)
                .ToListAsync();
                if (assistances is not null)
                {
                    return assistances;
                }
            }

            return null;
        }

        public async Task<Assistance?> GetByIdAsync(int id)
        {
            if (dc.Assistances is not null)
            {
                var assistance = await dc.Assistances   
				.Include(c => c.Membre)
				.Include(c => c.Mouvement)
				.Include(c => c.Utilisateur)
                .Where(c => c.Id == id)
                .FirstAsync();
                if(assistance is not null)
                {
                    return assistance;
                }
            }

            return null;
        }
    }
}
using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class UtilisateurRepository(DataContext dc) : IUtilisateurRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Utilisateur utilisateur)
        {
            if (dc.Utilisateurs is not null && utilisateur is not null)
            {
                dc.Utilisateurs.Add(utilisateur);
            }
        }

        public void Delete(int id)
        {
            if (dc.Utilisateurs is not null)
            {
                var utilisateur = dc.Utilisateurs.Find(id);
				if(utilisateur != null) {
					dc.Utilisateurs.Remove(utilisateur);
				}
            }
        }

        public async Task<Utilisateur?> GetByIdAsync(int id)
        {
            if (dc.Utilisateurs is not null)
            {
                var utilisateur = await dc.Utilisateurs
                .Where(s => s.Id == id)
                .FirstAsync();
                if (utilisateur is not null)
                {
                    return utilisateur;
                }
            }

            return null;
        }

        public async Task<Utilisateur?> GetByLoginAsync(string login)
        {
            if(dc.Utilisateurs is not null) {
                var utilisateur = await dc.Utilisateurs
                .Where(s => s.Login == login)
                .FirstAsync();
                if(utilisateur is not null) {
                    return utilisateur;
                }
            }

            return null;
        }

        public async Task<IEnumerable<Utilisateur>?> GetAllAsync()
        {
            if(dc.Utilisateurs is not null) {
                var utilisateurs = await dc.Utilisateurs
                .ToListAsync();
                if(utilisateurs is not null) {
                    return utilisateurs;
                }
            }

            return null;
        }
    }
}
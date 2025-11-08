using Microsoft.EntityFrameworkCore;
using mutuelleApi.interfaces;
using mutuelleApi.models;

namespace mutuelleApi.data.repo
{
    public class CreditRepository(DataContext dc) : ICreditRepository
    {
        public readonly DataContext dc = dc;

        public void Add(Credit credit)
        {
            if(dc.Credits is not null && credit is not null) {
                dc.Credits.Add(credit);
            }
        }

        public void Delete(int id)
        {
            if(dc.Credits is not null) {
                var credit = dc.Credits.Find(id);
				if(credit != null) {
					dc.Credits.Remove(credit);
				}
            }
        }

        public async Task<IEnumerable<Credit>?> GetAllAsync()
        {
            if(dc.Credits is not null) {
                var credits = await dc.Credits
                .Include(c => c.Membre)
                .Include(c => c.Mouvements)
                .Include(c => c.Echeances)
                .ThenInclude(e => e != null ? e.Mouvements: null)
                .ToListAsync();
                if(credits is not null) {
                    return credits;
                }
            }

            return null;
        }
		
		public async Task<Credit?> GetByIdAsync(int id)
        {
            if(dc.Credits is not null) {
                var credit = await dc.Credits
                .Include(c => c.Membre)
                .Include(c => c.Mouvements)
                .Include(c => c.Echeances)
                .ThenInclude(e => e != null ? e.Mouvements: null)
                .Where(x => x.Id == id)
                .FirstAsync();
                if (credit is not null) {
                    return credit;
                }
            }

            return null;
        }
    }
}
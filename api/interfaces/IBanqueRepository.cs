using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IBanqueRepository
    {
        Task<IEnumerable<Banque>?> GetAllAsync();
        Task<Banque?> GetByIdAsync(int id);
        void Add(Banque banque);
        void Delete(int id);
    }
}
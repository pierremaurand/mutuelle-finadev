using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface ICaisseRepository
    {
        Task<IEnumerable<Caisse>?> GetAllAsync();
        Task<Caisse?> GetByIdAsync(int id);
        void Add(Caisse caisse);
        void Delete(int id);
    }
}
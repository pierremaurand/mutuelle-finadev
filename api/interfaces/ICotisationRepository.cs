using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface ICotisationRepository
    {
        Task<IEnumerable<Cotisation>?> GetAllAsync();
        Task<Cotisation?> GetByIdAsync(int id);
        void Add(Cotisation cotisation);
        void Delete(int id);
    }
}
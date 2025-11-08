using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IAgenceRepository
    {
        Task<IEnumerable<Agence>?> GetAllAsync();
        Task<Agence?> GetByIdAsync(int id);
        void Add(Agence agence);
        void Delete(int id);
    }
}
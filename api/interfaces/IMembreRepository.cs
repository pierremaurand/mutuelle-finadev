using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IMembreRepository
    {
        Task<IEnumerable<Membre>?> GetAllAsync();
        Task<Membre?> GetByIdAsync(int id);
        void Add(Membre membre);
        void Delete(int id);
    }
}
using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IAdhesionRepository
    {
        Task<IEnumerable<Adhesion>?> GetAllAsync();
        Task<Adhesion?> GetByIdAsync(int id);
        void Add(Adhesion adhesion);
        void Delete(int id);
    }
}
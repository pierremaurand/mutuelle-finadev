using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IMouvementRepository
    {
        Task<IEnumerable<Mouvement>?> GetAllAsync();
        Task<Mouvement?> GetByIdAsync(int id);
        void Add(Mouvement mouvement);
        void Delete(int id);
    }
}
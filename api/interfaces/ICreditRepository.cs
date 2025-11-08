using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface ICreditRepository
    {
        Task<IEnumerable<Credit>?> GetAllAsync();
        Task<Credit?> GetByIdAsync(int id);
        void Add(Credit credit);
        void Delete(int id);
    }
}
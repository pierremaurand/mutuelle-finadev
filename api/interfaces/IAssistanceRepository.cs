using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IAssistanceRepository
    {
        Task<IEnumerable<Assistance>?> GetAllAsync();
        Task<Assistance?> GetByIdAsync(int id);
        void Add(Assistance assistance);
        void Delete(int id);
    }
}
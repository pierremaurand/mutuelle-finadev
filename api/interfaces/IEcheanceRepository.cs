using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IEcheanceRepository
    {
        Task<IEnumerable<Echeance>?> GetAllAsync();
		Task<Echeance?> GetByIdAsync(int id);
        void Add(Echeance echeance);
        void Delete(int id);
    }
}
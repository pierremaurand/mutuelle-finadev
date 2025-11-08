using mutuelleApi.models;

namespace mutuelleApi.interfaces
{
    public interface IAvanceRepository
    {
        Task<IEnumerable<Avance>?> GetAllAsync();
        void Add(Avance avance);
        void Delete(int id);
		Task<Avance?> GetByIdAsync(int id);
    }
}
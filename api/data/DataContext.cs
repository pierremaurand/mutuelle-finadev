using Microsoft.EntityFrameworkCore;
using mutuelleApi.models;

namespace mutuelleApi.data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<Adhesion>? Adhesions { get; set; }
        public DbSet<Agence>? Agences { get; set; }
        public DbSet<Avance>? Avances { get; set; }
        public DbSet<Banque>? Banques { get; set; }
        public DbSet<Caisse>? Caisses { get; set; }
        public DbSet<Cotisation>? Cotisations { get; set; }
        public DbSet<Credit>? Credits { get; set; }
        public DbSet<Echeance>? Echeances { get; set; }
        public DbSet<Membre>? Membres { get; set; }
        public DbSet<Mouvement>? Mouvements { get; set; }
        public DbSet<Utilisateur>? Utilisateurs { get; set; }
    }
}
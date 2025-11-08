using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Caisse : BaseEntity
    {
        public int AgentId { get; set; }
        public string DateCaisse { get; set; } = DateTime.Now.ToString("yyyy-MM-dd");
        public List<Mouvement> Mouvements { get; set; } = [];

        [ForeignKey("AgentId")]
        public Utilisateur? Agent { get; set; }
        public string Nom => Agent?.Login ?? "";

        public double TotalDebit => Mouvements.FindAll(x => x.DateMouvement == DateCaisse).Sum(m => (long)m.MontantDebit);
        public double TotalCredit => Mouvements.FindAll(x => x.DateMouvement == DateCaisse).Sum(m => (long)m.MontantCredit);
        public double Solde => TotalCredit - TotalDebit;

        [ForeignKey("ModifiePar")]
        public Utilisateur? Createur { get; set; }
        public string UtilisateurLogin => Createur?.Login ?? "";
    }
}
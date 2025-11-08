using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Banque : BaseEntity
    {
        public string Nom { get; set; } = string.Empty;
        public List<Mouvement>? Mouvements { get; set; }

        [ForeignKey("ModifiePar")]
        public Utilisateur? Utilisateur { get; set; }
        public string UtilisateurLogin => Utilisateur?.Login ?? "";

        public double TotalDebit => Mouvements?.Sum(m => m.MontantDebit) ?? 0;
        public double TotalCredit => Mouvements?.Sum(m => m.MontantCredit) ?? 0;
        public double Solde => TotalDebit - TotalCredit;
    }
}
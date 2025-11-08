using System.ComponentModel.DataAnnotations.Schema;

namespace mutuelleApi.models
{
    public class Agence : BaseEntity
    {
      public string Nom { get; set; } = string.Empty;
      public List<Membre>? Membres { get; set; }

      public int MembresActifs => Membres?.Count(e => e.EstActif)??0;
		
      [ForeignKey("ModifiePar")]
      public Utilisateur? Utilisateur { get; set; }
      
      public string UtilisateurLogin => Utilisateur?.Login ?? "";
    }
}
export class Mouvement {
  id: number = 0;
  dateMouvement: string = '';
  montantDebit: number = 0;
  montantCredit: number = 0;
  libelle: string = '';
  utilisateurLogin: string = '';

  montantCapital: number = 0;
  montantComission: number = 0;
  montantInterets: number = 0;

  membreId?: number;
  caisseId?: number;
  cotisationId?: number;
  avanceId?: number;
  creditId?: number;
  adhesionId?: number;
  banqueId?: number;
  echeanceId?: number;
}

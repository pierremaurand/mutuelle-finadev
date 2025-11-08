export class MouvementRequest {
  dateMouvement: string = '';
  montantDebit: number = 0;
  montantCredit: number = 0;
  libelle: string = '';
  utilisateurLogin: string = '';

  montantCapital?: number;
  montantCommission?: number;
  montantInterets?: number;

  membreId?: number;
  caisseId?: number;
  cotisationId?: number;
  avanceId?: number;
  creditId?: number;
  adhesionId?: number;
  banqueId?: number;
  echeanceId?: number;
}

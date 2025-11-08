export class Echeance {
  id?: number = 0;
  creditId?: number = 0;
  avanceId?: number = 0;
  membreId?: number = 0;
  dateEcheance?: string = '';
  montantCapital?: number = 0;
  montantCommission?: number = 0;
  montantInterets?: number = 0;
  datePaiement?: string = '';
  dateAnticipation?: string = '';

  montantTotal?: number = 0;
  montantCapitalRestant?: number = 0;
  status?: string = '';

  nom?: string = '';
  photo?: string = '';
  nomSexe?: string = '';
  nomAgence?: string = '';
}

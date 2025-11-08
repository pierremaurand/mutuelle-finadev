export class Credit {
  id?: number = 0;
  membreId?: number = 0;
  duree?: number = 0;
  montantCapital?: number = 0;
  montantCommission?: number = 0;
  montantInterets?: number = 0;
  dateDemande?: string = '';
  dateDecaissement?: string = '';

  montantTotal?: number = 0;
  montantCapitalRestant?: number = 0;
  montantCommissionRestant?: number = 0;
  montantInteretsRestant?: number = 0;

  status?: string = '';
  nombreEcheancePaye?: number = 0;
  nombreEcheanceImpaye?: number = 0;
  dateDerniereEcheance?: string = '';

  nom?: string = '';
  photo?: string = '';
  nomSexe?: string = '';
  agenceId?: number = 0;
}

export class InfosPret {
  id?: number;
  nom?: string;
  photo?: string;
  nomSexe?: string;

  estActif?: boolean;
  dateNaissance?: string;
  lieuNaissance?: string;
  dateAdhesion?: string;
  telephone?: string;
  email?: string;
  nomAgence?: string;

  //Infos pret
  dateDemande?: string;
  status?: string;
  nombreEcheancePaye?: number;
  nombreEcheanceImpaye?: number;
  agenceId?: number;
  dateDecaissement?: string;
  dateDerniereEcheance?: string;
  montantCapitalRestant?: number;
  montantCapital?: number;
  montantCommission?: number;
  montantInterets?: number;
  duree?: number;

  //Infos cotisation
  retenue?: number;
  dateCotisation?: string;

  //Infos adhésion
  montant?: number;
  membreId?: number;
}

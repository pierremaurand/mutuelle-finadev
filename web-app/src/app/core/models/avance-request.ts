import { EcheanceAvanceRequest } from './echeance-avance-request';

export class AvanceRequest {
  membreId: number = 0;
  duree: number = 0;
  montantCapital: number = 0;
  dateDemande: string = '';
  dateDecaissement: string = '';
  echeances: EcheanceAvanceRequest[] = [];
}

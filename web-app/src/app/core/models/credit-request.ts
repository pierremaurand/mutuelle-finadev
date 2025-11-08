import { EcheanceCreditRequest } from './echeance-credit-request';

export class CreditRequest {
  membreId: number = 0;
  duree: number = 0;
  montantCapital: number = 0;
  montantCommission: number = 0;
  montantInterets: number = 0;
  dateDemande: string = '';
  dateDecaissement: string = '';
  echeances: EcheanceCreditRequest[] = [];
}
